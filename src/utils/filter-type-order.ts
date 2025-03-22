import { Product } from "./product";

// Possible product types that might be detected in product names
export type ProductType =
  | 'Top-up'
  | 'Weekly Diamond Pass'
  | 'Membership'
  | 'Skin'
  | 'Bundle'
  | 'Pulsa'
  | 'Data';

/**
 * Filter products by type based on product name content
 * @param plans All available products
 * @param selectedType The type of product to filter for
 * @returns Filtered list of products matching the selected type
 */
export function filterProductsByType(
  plans: Product[],
  selectedType: ProductType
): Product[] {
  if (!plans || plans.length === 0) return [];

  return plans.filter((plan) => {
    const name = plan.product_name.toLowerCase();

    switch (selectedType) {
      case 'Top-up':
        // Regular top-ups (doesn't include special keywords)
        return (
          !name.includes('weekly') &&
          !name.includes('diamond pass') &&
          !name.includes('membership') &&
          !name.includes('skin') &&
          !name.includes('bundle') &&
          !name.includes('pulsa') &&
          !name.includes('data')
        );

      case 'Weekly Diamond Pass':
        return name.includes('weekly') && name.includes('diamond pass');

      case 'Membership':
        return name.includes('membership');

      case 'Skin':
        return name.includes('skin');

      case 'Bundle':
        return name.includes('bundle');

      case 'Pulsa':
        return name.includes('pulsa');

      case 'Data':
        return name.includes('data');

      default:
        return true;
    }
  });
}

/**
 * Get all available product types from a list of products
 * @param plans All available products
 * @returns Array of product types found in the products
 */
export function getAvailableProductTypes(plans: Product[]): ProductType[] {
  if (!plans || plans.length === 0) return [];

  const types: ProductType[] = [];

  // Check for each product type
  if (
    plans.some((plan) => {
      const name = plan.product_name.toLowerCase();
      return (
        !name.includes('weekly') &&
        !name.includes('diamond pass') &&
        !name.includes('membership') &&
        !name.includes('skin') &&
        !name.includes('bundle') &&
        !name.includes('pulsa') &&
        !name.includes('data')
      );
    })
  ) {
    types.push('Top-up');
  }

  if (
    plans.some(
      (plan) =>
        plan.product_name.toLowerCase().includes('weekly') &&
        plan.product_name.toLowerCase().includes('diamond pass')
    )
  ) {
    types.push('Weekly Diamond Pass');
  }

  if (
    plans.some((plan) => plan.product_name.toLowerCase().includes('membership'))
  ) {
    types.push('Membership');
  }

  if (plans.some((plan) => plan.product_name.toLowerCase().includes('skin'))) {
    types.push('Skin');
  }

  if (
    plans.some((plan) => plan.product_name.toLowerCase().includes('bundle'))
  ) {
    types.push('Bundle');
  }

  if (plans.some((plan) => plan.product_name.toLowerCase().includes('pulsa'))) {
    types.push('Pulsa');
  }

  if (plans.some((plan) => plan.product_name.toLowerCase().includes('data'))) {
    types.push('Data');
  }

  return types;
}
