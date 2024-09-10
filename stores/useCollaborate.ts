import * as Y from "yjs";
import {
  type Edge,
  type Node,
  type EdgeChange,
  type NodeChange,
  useVueFlow,
} from "@vue-flow/core";
import { COLLABORATE_ID, VUEFLOW_ID } from "~/constants/key";
import throttle from "lodash/throttle";
import YjsService from "~/lib/yjs-service";
import { DEFAULT_WS_CONFIG, SYNC_THROTTLE } from "~/constants/yjs";

export const useCollaborate = defineStore(COLLABORATE_ID, () => {
  const { applyEdgeChanges, applyNodeChanges } = useVueFlow(VUEFLOW_ID);

  const yjs = ref<YjsService>(
    new YjsService({
      // Update provider type here if needed
      providerType: "websocket",
    }),
  );

  const ymapErdState = ref<Y.Map<Edge[] | Node[]>>(
    new Y.Map<Edge[] | Node[]>(),
  );
  const yarrayEdgeChanges = ref<Y.Array<EdgeChange>>(new Y.Array<EdgeChange>());
  const yarrayNodeChanges = ref<Y.Array<NodeChange>>(new Y.Array<NodeChange>());

  function connect(): void {
    try {
      yjs.value.establishConnection({
        ...DEFAULT_WS_CONFIG,
        // Optional args, by default the Yjs service already handle these default value
        // roomId:
        // wsUrl:
      });
      getRoomState();
      subscribe();
    } catch (error) {
      errorHandler(error);
    }
  }

  onUnmounted(() => {
    yjs.value.destroy();
  });

  function getRoomState(): void {
    if (!yjs.value.ydoc) {
      return;
    }

    ymapErdState.value = yjs.value.ydoc.getMap("yerdState");

    yarrayEdgeChanges.value = yjs.value.ydoc.getArray("edgeChanges");
    yarrayNodeChanges.value = yjs.value.ydoc.getArray("nodeChanges");
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
    if (!Array.isArray(changes) || !yjs.value.ydoc) return;

    yjs.value.ydoc.transact(() => {
      yarrayEdgeChanges.value.push(changes);
    });

    yarrayEdgeChanges.value.delete(0, yarrayEdgeChanges.value.length);
  }

  function broadcastNodeChange(changes: NodeChange[]): void {
    if (!Array.isArray(changes) || !yjs.value.ydoc) return;

    const operation = (changes: NodeChange[]) => {
      if (!yjs.value.ydoc) return;
      yjs.value.ydoc.transact(() => {
        yarrayNodeChanges.value.push(changes);
      });

      yarrayNodeChanges.value.delete(0, yarrayNodeChanges.value.length);
    };

    // If user drag node, don't send data too frequently because it slow down performance. tested on slow internet.
    // high throttle ms may result in longer delay
    if (nodeChangesContainPosition(changes)) {
      throttle(() => {
        operation(changes);
      }, SYNC_THROTTLE)();
      return;
    }
    operation(changes);
  }

  return {
    connect,
    startAwareness,
    stopAwareness,
    broadcastEdgeChange,
    broadcastNodeChange,
  };
});
