import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import type { Awareness } from "y-protocols/awareness.js";
import {
  type Edge,
  type Node,
  type EdgeChange,
  type NodeChange,
  useVueFlow,
} from "@vue-flow/core";
import { COLLABORATE_ID, VUEFLOW_ID } from "~/constants/key";
import debounce from "lodash/debounce";

type EstablishWebRtcConnection = {
  roomId?: string;
  password?: string;
  signaling?: string;
};

/*
 * Usage: call establishConnection() on client side (onMounted)
 */
export const useCollaborate = defineStore(COLLABORATE_ID, () => {
  const { applyEdgeChanges, applyNodeChanges } = useVueFlow(VUEFLOW_ID);

  const ydoc = ref<Y.Doc>();
  const webrtcProvider = ref<WebrtcProvider>();

  const awareness = ref<Awareness>();

  const ymapErdState = ref<Y.Map<Edge[] | Node[]>>(
    new Y.Map<Edge[] | Node[]>(),
  );
  const yarrayEdgeChanges = ref<Y.Array<EdgeChange>>(new Y.Array<EdgeChange>());
  const yarrayNodeChanges = ref<Y.Array<NodeChange>>(new Y.Array<NodeChange>());

  onUnmounted(() => {
    destroy();
  });

  function establishConnection({
    roomId = "public-room",
    password = "optional-room-password",
    signaling = getWebRTCSignalServer(),
  }: EstablishWebRtcConnection = {}): void {
    logger.info(
      `Establishing yjs webrtc connection! signal server url: ${getWebRTCSignalServer()}, room id: ${roomId}`,
    );

    if (!process.client) {
      throw new YatoErDError(
        YatoErDErrorCode.Yjs_WebRTC_Must_Establish_In_Client_Side,
      );
    }

    ydoc.value = new Y.Doc();

    webrtcProvider.value = new WebrtcProvider(roomId, ydoc.value, {
      password,
      // Peers using the same signaling server will find each other
      signaling: [signaling],
      // Maximal number of WebRTC connections.
      maxConns: 20 + Math.floor(Math.random() * 15),
    });
    awareness.value = webrtcProvider.value.awareness;

    // TODO: Add awareness
    awareness.value.setLocalStateField("user", {
      name: "Oni",
    });

    getRoomState();
    subscribe();
  }

  function getRoomState(): void {
    if (!ydoc.value) {
      return;
    }

    ymapErdState.value = ydoc.value.getMap("yerdState");

    yarrayEdgeChanges.value = ydoc.value.getArray("edgeChanges");
    yarrayNodeChanges.value = ydoc.value.getArray("nodeChanges");
  }

  function subscribe(): void {
    yarrayNodeChanges.value.observe((event, transaction) => {
      if (transaction.local) {
        return;
      }

      applyNodeChanges(yarrayNodeChanges.value.toArray());
    });

    yarrayEdgeChanges.value.observe((event, transaction) => {
      if (transaction.local) {
        return;
      }

      applyEdgeChanges(yarrayEdgeChanges.value.toArray());
    });
  }

  function destroy(): void {
    if (webrtcProvider.value) {
      logger.info("Disconnecting WebRtc");
      webrtcProvider.value.disconnect();
    }

    if (ydoc.value) {
      ydoc.value.destroy();
    }

    if (awareness.value) {
      awareness.value.destroy();
    }
  }

  function getYMapNodes(): Node[] {
    // TODO: use zod to validate
    const nodes = ymapErdState.value.get("nodes") as Node[];

    if (Array.isArray(nodes)) {
      return nodes;
    }

    logger.warn("YMapNodes is not an array, return empty array");
    return [];
  }

  function getYMapEdges(): Edge[] {
    // TODO: use zod to validate
    const edges = ymapErdState.value.get("edges") as Edge[];

    if (Array.isArray(edges)) {
      return edges;
    }

    logger.warn("YMapEdges is not an array, return empty array");
    return [];
  }

  function startAwareness(): void {
    // TODO: implement
  }

  function stopAwareness(): void {
    // TODO: implement
  }

  function broadcastEdgeChange(changes: EdgeChange[]): void {
    if (!Array.isArray(changes)) {
      return;
    }

    ydoc.value?.transact(() => {
      yarrayEdgeChanges.value.push(changes);
    });

    yarrayEdgeChanges.value.delete(0, yarrayEdgeChanges.value.length);
  }

  function broadcastNodeChange(changes: NodeChange[]): void {
    if (!Array.isArray(changes)) return;

    const operation = (changes: NodeChange[]) => {
      ydoc.value?.transact(() => {
        yarrayNodeChanges.value.push(changes);
      });

      yarrayNodeChanges.value.delete(0, yarrayNodeChanges.value.length);
    };

    // If user drag node, don't send data too frequently because it slow down performance. tested on slow internet.
    // high debounce ms may result in longer delay
    if (changes.some((c) => c.type === "position")) {
      debounce(() => {
        operation(changes);
      }, 2)();
      return;
    }
    operation(changes);
  }

  return {
    ydoc,
    awareness,
    wrtcProvider: webrtcProvider,
    getYMapNodes,
    getYMapEdges,
    establishConnection,
    startAwareness,
    stopAwareness,
    broadcastEdgeChange,
    broadcastNodeChange,
  };
});
