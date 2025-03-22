export function getInitials(name?: string | null): string {
  if (!name) return '??';
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();
  return initials.slice(0, 2);
}
