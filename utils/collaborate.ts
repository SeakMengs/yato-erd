import type { NodeChange } from "@vue-flow/core";

export function getWebRTCSignalServer(): string {
  const runtime = useRuntimeConfig();

  if (runtime.public.WEB_RTC_SIGNAL) {
    return runtime.public.WEB_RTC_SIGNAL;
  }

  return "ws://localhost:4444";
}

export function getWebsocketUrl(): string {
  const runtime = useRuntimeConfig();

  if (runtime.public.WS_URL) {
    return runtime.public.WS_URL;
  }

  return "ws://localhost:1234";
}

export function nodeChangesContainPosition(changes: NodeChange[]): boolean {
  return changes.some((c) => c.type === "position");
}

export function generateRandomRoomId(): string {
  // TODO: remove default room
  return "default-room";
  return generateId(8);
}
