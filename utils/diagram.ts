import type { Connection } from "@vue-flow/core";
import type { Position } from "@vueuse/core";

export function generateRandomNodePosition(): Position {
  return {
    x: Math.random() * 400,
    y: Math.random() * 400,
  };
}

export function isValidEdgeConnection(connection: Connection): boolean {
  // Prevent handle to connect with it own node (table basically)
  return connection.source !== connection.target;
}
