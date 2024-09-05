export function generateId(length: number = 5): string {
  if (length > 36) {
    logger.warn("Generate id fall back to its maximum length: 36");
    length = 36;
  }

  return crypto.randomUUID().toString().substring(0, length);
}
