import type { Position } from "@vueuse/core";

export function generateRandomNodePosition(): Position {
  return {
    x: Math.random() * 400,
    y: Math.random() * 400,
  };
}
