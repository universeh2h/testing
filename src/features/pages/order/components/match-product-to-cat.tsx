import { PlansProps, SubCategories } from '@/types/category';

//// Helper untuk mencocokkan produk dengan kategori
export const matchProductToCategory = (
  plan: PlansProps,
  category: SubCategories
): boolean => {
  // Case 1: Top-up adalah kategori khusus
  if (
    category.name.toLowerCase() === 'top-up' ||
    category.code?.toLowerCase() === 'top-up'
  ) {
    // Untuk top-up, gunakan logika khusus jika perlu
    return true;
  }

  if (plan.subCategoryId && category.id) {
    if (Number(plan.subCategoryId) === Number(category.id)) {
      return true;
    }
  }

  if (
    (plan.layanan && category.code?.toLowerCase() === 'data') ||
    category.name.toLowerCase().includes('data') ||
    category.name.toLowerCase().includes('internet')
  ) {
    const layananLower = String(plan.layanan).toLowerCase();
    if (
      layananLower.includes('gb') ||
      layananLower.includes('data') ||
      layananLower.includes('internet')
    ) {
      return true;
    }
  }

  // Case 4: Periksa berdasarkan providerId dan code
  if (plan.providerId && category.code) {
    const providerIdLower = String(plan.providerId).toLowerCase();
    const categoryCodeLower = String(category.code).toLowerCase();

    const categoryMappings: Record<string, string[]> = {
      pulsa: ['pulsa', 'pls', 'credit', 'pulsa transfer', 'Pulsa Transfer'],
      data: ['data', 'internet', 'gb', 'mb', 'adb', 'max', 'alwayson', 'combo'],
      voucher: ['voucher', 'vcr', 'vch'],
      game: ['game', 'games', 'gmg'],
      pln: ['pln', 'listrik', 'electric'],
      pakettelp: ['telp', 'call', 'voice', 'telpn'],
    };

    // Periksa berdasarkan mapping
    if (categoryMappings[categoryCodeLower]) {
      return categoryMappings[categoryCodeLower].some((keyword) =>
        providerIdLower.includes(keyword)
      );
    }

    // Fallback ke pengecekan umum
    return (
      providerIdLower.includes(categoryCodeLower) ||
      categoryCodeLower.includes(providerIdLower)
    );
  }

  return false;
};
