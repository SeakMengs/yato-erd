import type { ERDState } from "~/stores/useErd";
import { EdgeType } from "~/types/diagram/edge";
import { SECOND } from "./time";

export const ERD_STATE_AUTO_SAVE_MS = SECOND * 10;

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

export const MAX_ZOOM = 4;
export const MIN_ZOOM = 0.2;
export const DEFAULT_ZOOM = 0.8;
