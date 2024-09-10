import type {
  EstablishWebRtcConnection,
  EstablishWebsocketConnection,
} from "~/lib/yjs-service";

// YJS sync batch with other peers every ms
export const SYNC_THROTTLE = 100;

export const DEFAULT_WS_CONFIG = {
  roomId: generateRandomRoomId(),
  type: "websocket",
} satisfies EstablishWebsocketConnection;

export const DEFAULT_WEBRTC_CONFIG = {
  type: "webrtc",
  roomId: generateRandomRoomId(),
  password: "optional-password",
} satisfies EstablishWebRtcConnection;
