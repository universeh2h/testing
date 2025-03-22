export function GenerateMerchantOrderID(depositId: number, userId: number) {
    // Use both deposit ID and user ID for uniqueness
    return `DEP-${userId}-${depositId}-${Date.now()}`;
  }