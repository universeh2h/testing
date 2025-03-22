import { NextResponse } from 'next/server';
import { Digiflazz } from '@/lib/digiflazz';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Starting Digiflazz price check process...');

    // Get credentials
    const username = process.env.DIGI_USERNAME;
    const apiKey = process.env.DIGI_API_KEY;
    const settingweb =  await prisma.websiteConfig.findFirst()

    if (!username || !apiKey ) {
      console.error('Missing Digiflazz credentials');
      return NextResponse.json(
        { error: 'Missing API credentials' },
        { status: 500 }
      );
    }

    console.log('Credentials loaded, initializing Digiflazz client...');
    const digiflazz = new Digiflazz(username, apiKey);

    // Get price list from Digiflazz with better error handling
    console.log('Fetching price list from Digiflazz...');
    let rawResponse;
    try {
      rawResponse = await digiflazz.checkPrice();
    } catch (e ) {
      console.error('Error fetching from Digiflazz API:', e);
      return NextResponse.json(
        { error: 'Failed to fetch price list: ' + (e instanceof Error ?  e.message : e) },
        { status: 500 }
      );
    }

    console.log('Digiflazz API response received');
    console.log('Response type:', typeof rawResponse);

    // Extract the data array
    let dataArray;

    // Try different response formats
    if (typeof rawResponse === 'string') {
      try {
        rawResponse = JSON.parse(rawResponse);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
      }
    }

    // Check if response is direct array or has a data property
    if (Array.isArray(rawResponse)) {
      dataArray = rawResponse;
    } else if (rawResponse && typeof rawResponse === 'object') {
      // Try to find the data array - common API patterns
      if (Array.isArray(rawResponse.data)) {
        dataArray = rawResponse.data;
      } else if (
        rawResponse.response &&
        Array.isArray(rawResponse.response.data)
      ) {
        dataArray = rawResponse.response.data;
      } else {
        // Log what we actually received
        console.error(
          'Unexpected response structure:',
          JSON.stringify(rawResponse).substring(0, 1000)
        );
        return NextResponse.json(
          { error: 'Invalid response format - data array not found' },
          { status: 500 }
        );
      }
    } else {
      console.error('Unexpected response type:', rawResponse);
      return NextResponse.json(
        { error: 'Invalid response format' },
        { status: 500 }
      );
    }

    console.log(
      `Successfully extracted data array with ${dataArray.length} items`
    );

    // Sample a few items to verify structure
    if (dataArray.length > 0) {
      console.log('First item sample:', JSON.stringify(dataArray[0]));
    }

    // Get all categories from database
    console.log('Fetching categories from database...');
    const categories = await prisma.categories.findMany();
    console.log(`Found ${categories.length} categories in database`);

    if (categories.length === 0) {
      console.warn('No categories found in database, nothing to process');
      return NextResponse.json({
        message: 'No categories to process',
        stats: { processed: 0, created: 0, updated: 0 },
      });
    }

    // Log a few categories for debugging
    console.log(
      'Category samples:',
      categories.slice(0, 3).map((c) => ({ id: c.id, brand: c.brand }))
    );

    // Track statistics
    let stats = { processed: 0, created: 0, updated: 0 };
    let categoryMatches = {};

    // Process each category and match with data items
    for (const category of categories) {
      console.log(
        `Processing category ID: ${category.id}, Brand: ${
          category.brand || 'N/A'
        }`
      );

      if (!category.brand) {
        console.warn(`Category ID ${category.id} has no brand, skipping`);
        continue;
      }

      let matchCount = 0;

      // For each data item, check if it matches the current category
      for (const item of dataArray) {
        // Skip invalid items
        if (!item || typeof item !== 'object') {
          continue;
        }

        if (item.brand.toUpperCase() === category.brand.toUpperCase()) {
          matchCount++;
          stats.processed++;

          let defaultProfits = {
            profit: 4,
            profitReseller: 3,
            profitPlatinum: 1,
            profitGold: 2,
          };

          if (item.category === 'Voucher' || item.category === 'PLN') {
            defaultProfits = {
              profit: 4,
              profitReseller: 4,
              profitPlatinum: 2,
              profitGold: 3,
            };
          }

          try {
            // Check if service already exists
            const existingService = await prisma.layanan.findFirst({
              where: { providerId: item.buyer_sku_code },
            });

            if (!existingService) {
              // Create new service
              console.log(
                `Creating new service: ${item.product_name} (${item.buyer_sku_code})`
              );

              try {
                // Calculate base price with profit margins
                const regularPrice = Math.round(
                  item.price + (item.price * defaultProfits.profit) / 100
                );
                const resellerPrice = Math.round(
                  item.price +
                    (item.price * defaultProfits.profitReseller) / 100
                );
                const goldPrice = Math.round(
                  item.price + (item.price * defaultProfits.profitGold) / 100
                );

                // For platinum, apply the profit margin and then subtract 1%
                const platinumBasePrice = Math.round(
                  item.price +
                    (item.price * defaultProfits.profitPlatinum) / 100
                );
                const platinumPrice = Math.round(platinumBasePrice * 0.99); // Apply 1% discount

                await prisma.layanan.create({
                  data: {
                    layanan: item.product_name,
                    kategoriId: category.id,
                    providerId: item.buyer_sku_code,
                    harga: regularPrice,
                    hargaReseller: resellerPrice,
                    hargaPlatinum: platinumPrice, // Discounted platinum price
                    hargaGold: goldPrice,
                    profit: defaultProfits.profit,
                    profitReseller: defaultProfits.profitReseller,
                    profitPlatinum: defaultProfits.profitPlatinum,
                    profitGold: defaultProfits.profitGold,
                    catatan: item.desc || '',
                    status: item.seller_product_status,
                    provider: 'digiflazz',
                    productLogo: null,
                    subCategoryId: 1,
                    isFlashSale: false,
                  },
                });
                stats.created++;
              } catch (createError) {
                console.error(
                  `Failed to create service ${item.buyer_sku_code}:`,
                  createError
                );
              }
            } else {
              // Update existing service
              console.log(
                `Updating existing service: ${item.product_name} (${item.buyer_sku_code})`
              );

              try {
                // Calculate regular prices with profit margins
                const regularPrice = Math.round(
                  item.price + (item.price * existingService.profit) / 100
                );
                const resellerPrice = Math.round(
                  item.price +
                    (item.price * existingService.profitReseller) / 100
                );
                const goldPrice = Math.round(
                  item.price + (item.price * existingService.profitGold) / 100
                );

                // For platinum, apply the profit margin and then subtract 1%
                const platinumBasePrice = Math.round(
                  item.price +
                    (item.price * existingService.profitPlatinum) / 100
                );
                const platinumPrice = Math.round(platinumBasePrice * 0.99); // Apply 1% discount

                await prisma.layanan.update({
                  where: { id: existingService.id },
                  data: {
                    harga: regularPrice,
                    hargaReseller: resellerPrice,
                    hargaPlatinum: platinumPrice, // Discounted platinum price
                    hargaGold: goldPrice,
                    status: item.seller_product_status,
                  },
                });
                stats.updated++;
              } catch (updateError) {
                console.error(
                  `Failed to update service ${item.buyer_sku_code}:`,
                  updateError
                );
              }
            }
          } catch (error) {
            console.error(`Error processing ${item.buyer_sku_code}:`, error);
          }
        }
      }

      categoryMatches[category.brand] = matchCount;
      console.log(`Found ${matchCount} matches for category ${category.brand}`);
    }

    console.log(
      'Processing complete. Category match summary:',
      categoryMatches
    );
    console.log('Final statistics:', stats);

    return NextResponse.json({
      message: 'Data processed successfully',
      stats,
      categoryMatches,
    });
  } catch (error) {
    console.error('Unhandled error in API route:', error);
    return NextResponse.json(
      {
        error: String(error),
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
