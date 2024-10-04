import type { ERDState } from "~/stores/useErd";
import { EdgeType } from "~/types/diagram/edge";

// 10 seconds
export const ERD_STATE_AUTO_SAVE_MS = 10 * 1000;

export const DEFAULT_EDGE_TYPE = EdgeType.ERD;

export const DEFAULT_ERD_STATE = {
  edges: [],
  nodes: [],
  viewport: {
    x: 0,
    y: 0,
    zoom: 1,
  },
} satisfies ERDState;
