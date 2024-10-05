import type {
  EstablishWebRtcConnection,
  EstablishWebsocketConnection,
} from "~/lib/yjs-service";
import { SECOND } from "./time";

// YJS sync with other peers every ms
export const SYNC_THROTTLE = 100;

export const SYNC_NODES_DELAY = SECOND * 10;
export const SYNC_EDGES_DELAY = SECOND * 10;

export const DEFAULT_WS_CONFIG = {
  roomId: generateRandomRoomId(),
  type: "websocket",
} satisfies EstablishWebsocketConnection;

export const DEFAULT_WEBRTC_CONFIG = {
  type: "webrtc",
  roomId: generateRandomRoomId(),
  password: "optional-password",
} satisfies EstablishWebRtcConnection;
