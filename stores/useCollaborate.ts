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
import isEqual from "lodash/isEqual.js";
import YjsService from "~/lib/yjs-service";
import {
  DEFAULT_WS_CONFIG,
  SYNC_EDGES_DELAY,
  SYNC_NODES_DELAY,
  SYNC_THROTTLE,
} from "~/constants/yjs";

export const useCollaborate = defineStore(COLLABORATE_ID, () => {
  const {
    applyEdgeChanges,
    applyNodeChanges,
    setNodes,
    setEdges,
    getNodes,
    getEdges,
  } = useVueFlow(VUEFLOW_ID);

  const yjs = ref<YjsService>(
    new YjsService({
      // Update provider type here if needed
      providerType: "websocket",
    }),
  );

  // For sync nodes and edges interval
  let syncNodesInterval: NodeJS.Timeout;
  let syncEdgesInterval: NodeJS.Timeout;

  const yarrayNodes = ref<Y.Array<Node>>(new Y.Array<Node>());
  const yarrayEdges = ref<Y.Array<Edge>>(new Y.Array<Edge>());
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

      // Sync nodes and edges every 5s (5s is subjected to change)
      syncNodesInterval = setInterval(() => {
        broadcastNodes();
      }, SYNC_NODES_DELAY);

      syncEdgesInterval = setInterval(() => {
        broadcastEdges();
      }, SYNC_EDGES_DELAY);
    } catch (error) {
      errorHandler(error);
    }
  }

  onUnmounted(() => {
    logger.info("useCollaborate unMounted, destroy yjs, and clear interval");
    yjs.value.destroy();

    clearInterval(syncNodesInterval);
    clearInterval(syncEdgesInterval);
  });

  function getRoomState(): void {
    if (!yjs.value.ydoc) {
      return;
    }

    yarrayEdges.value = yjs.value.ydoc.getArray("edges");
    yarrayNodes.value = yjs.value.ydoc.getArray("nodes");
    yarrayEdgeChanges.value = yjs.value.ydoc.getArray("edgeChanges");
    yarrayNodeChanges.value = yjs.value.ydoc.getArray("nodeChanges");

    setNodes(yarrayNodes.value.toArray());
    setEdges(yarrayEdges.value.toArray());
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

    yarrayNodes.value.observe((event, transaction) => {
      if (transaction.local) {
        return;
      }

      console.log("New nodes,", yarrayNodes.value.toArray());
      setNodes(yarrayNodes.value.toArray());
    });

    yarrayEdges.value.observe((event, transaction) => {
      if (transaction.local) {
        return;
      }

      setEdges(yarrayEdges.value.toArray());
    });
  }

  function startAwareness(): void {
    // TODO: implement
  }

  function stopAwareness(): void {
    // TODO: implement
  }

  function broadcastNodes(): void {
    if (!Array.isArray(getNodes.value) || !yjs.value.ydoc) return;
    const localNodes = validateNodes(getNodes.value);
    const syncNodes = validateNodes(yarrayNodes.value.toArray());

    if (isEqual(localNodes, syncNodes)) {
      return;
    }

    yjs.value.ydoc.transact(() => {
      yarrayNodes.value.delete(0, syncNodes.length);
      yarrayNodes.value.push(getNodes.value);

      // Since the nodes is already sync to the server, nodeChanges can be cleared
      yarrayNodeChanges.value.delete(0, yarrayNodeChanges.value.length);
    });
  }

  function broadcastEdges(): void {
    if (!Array.isArray(getEdges) || !yjs.value.ydoc) return;
    const localEdges = validateEdges(getEdges.value);
    const syncEdges = validateEdges(yarrayEdges.value);

    if (isEqual(localEdges, syncEdges)) {
      return;
    }

    yjs.value.ydoc.transact(() => {
      yarrayEdges.value.delete(0, syncEdges.length);
      yarrayEdges.value.insert(0, getEdges.value);

      // Since the edges is already sync to the server, edgeChanges can be cleared
      yarrayEdgeChanges.value.delete(0, yarrayEdgeChanges.value.length);
    });
  }

  function broadcastEdgeChange(changes: EdgeChange[]): void {
    if (!Array.isArray(changes) || !yjs.value.ydoc) return;

    yjs.value.ydoc.transact(() => {
      yarrayEdgeChanges.value.push(changes);
    });
  }

  function broadcastNodeChange(changes: NodeChange[]): void {
    if (!Array.isArray(changes) || !yjs.value.ydoc) return;

    const operation = (changes: NodeChange[]) => {
      if (!yjs.value.ydoc) return;
      yjs.value.ydoc.transact(() => {
        yarrayNodeChanges.value.push(changes);
      });
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
