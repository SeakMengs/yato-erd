export function generateShortId(length: number = 5): string {
  return crypto.randomUUID().toString().substring(0, length);
}
