import { Product } from "./product";

export function ValidateCategoryAndGenerateSku(product: Product): string {
  // Extract relevant information
  const productName = product.product_name || '';
  const category = product.category || '';
  const brand = product.brand || '';

  // Decode and normalize the brand name
  const normalizedBrand = decodeURIComponent(brand).toLowerCase().trim();

  const brandAbbreviations: Record<string, string> = {
    'mobile legends bang bang': 'ml',
    'mobile legends': 'ml',
    'arena breakout': 'ab',
    'astral guardians': 'ag',
    'free fire': 'ff',
    'pubg mobile': 'pubgm',
    'call of duty mobile': 'codm',
    'genshin impact': 'gi',
  };

  // Handle telecom operators
  const telecomOperators: Record<string, string> = {
    telkomsel: 'tsel',
    indosat: 'isat',
    'xl axiata': 'xl',
    axis: 'axis',
    smartfren: 'sf',
    three: 'tri',
  };

  let prefix = '';

  // Determine prefix based on product category and brand
  if (category.toLowerCase() === 'games') {
    // Check if brand has a predefined abbreviation
    prefix =
      brandAbbreviations[normalizedBrand] ||
      normalizedBrand.substring(0, 2).toLowerCase();
  } else if (
    category.toLowerCase() === 'data' ||
    category.toLowerCase() === 'pulsa'
  ) {
    // Use telecom abbreviations for data/pulsa products
    prefix =
      telecomOperators[normalizedBrand] ||
      normalizedBrand.substring(0, 2).toLowerCase();
  } else {
    // Default: use first 2 characters of brand as prefix
    prefix = normalizedBrand.substring(0, 2).toLowerCase();
  }

  // If product already has a buyer_sku_code, respect it
  if (product.buyer_sku_code) {
    return product.buyer_sku_code;
  }

  // Extract relevant details from product name
  const cleanedName = productName
    .toLowerCase()
    .replace(/[^\w\s\d]/g, '') // Remove special characters
    .trim();

  // Extract numeric values (like GB, diamonds amount)
  const numericMatch = cleanedName.match(/\d+(\.\d+)?/g);
  const numericValue = numericMatch ? numericMatch[0] : '';

  // Extract product type indicators
  let typeIndicator = '';
  if (product.type && product.type.toLowerCase() !== 'umum') {
    typeIndicator = product.type.substring(0, 1).toLowerCase();
  }

  // For data packages, check for common keywords
  if (category.toLowerCase() === 'data') {
    if (cleanedName.includes('bronet')) typeIndicator = 'b';
    else if (cleanedName.includes('kuota')) typeIndicator = 'k';
    else if (cleanedName.includes('unlimited')) typeIndicator = 'u';
  }

  // Assemble the SKU
  let sku = prefix.toUpperCase();

  if (typeIndicator) {
    sku += typeIndicator.toUpperCase();
  }

  if (numericValue) {
    sku += numericValue;
  }

  return sku;
}
