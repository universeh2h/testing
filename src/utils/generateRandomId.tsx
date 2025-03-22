export function GenerateRandomId(prefix?: string): string {
  return `${prefix ? prefix : 'VAZ'}-${Date.now()}${Math.floor(
    Math.random() * 100
  )}`;
}
