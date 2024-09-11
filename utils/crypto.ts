import { v4 as uuidv4 } from "uuid";

export function generateId(length: number = 5): string {
  if (length > 36) {
    logger.warn("Generate id fall back to its maximum length: 36");
    length = 36;
  }

  return uuidv4().toString().substring(0, length);
}
