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
import { VUEFLOW_ID } from "~/constants/key";

function getWebRTCSignalServer(): string {
  return import.meta.env.DEV ? "ws://localhost:4444" : "";
}

type UseCollaborateProps = {
  roomId?: string;
  signalServerUrl?: string;
  key?: string;
};

/*
 * Usage: call establishConnection() on client side (onMounted)
 */
export function useCollaborate({
  roomId = "public-room",
  signalServerUrl = getWebRTCSignalServer(),
  key = "collab",
}: UseCollaborateProps) {
  const { applyEdgeChanges, applyNodeChanges } = useVueFlow(VUEFLOW_ID);
  const edgeChanges = useState<EdgeChange[]>(`${key}-edgeChanges`, () => []);
  const nodeChanges = useState<NodeChange[]>(`${key}-nodeChanges`, () => []);

  const ydoc = useState<Y.Doc>(`${key}-ydoc`);
  const wrtcProvider = useState<WebrtcProvider>(`${key}-wrtcProvider`);
  const awareness = useState<Awareness>(`${key}-awareness`);

  const yMapErdState = ref<Y.Map<Edge[] | Node[]>>(
    new Y.Map<Edge[] | Node[]>(),
  );
  const yArrayEdgeChanges = ref<Y.Array<EdgeChange>>(new Y.Array<EdgeChange>());
  const yArrayNodeChanges = ref<Y.Array<NodeChange>>(new Y.Array<NodeChange>());

  // const usercolors = [
  //   "#30bced",
  //   "#6eeb83",
  //   "#ffbc42",
  //   "#ecd444",
  //   "l#ee6352",
  //   "#9ac2c9",
  //   "#8acb88",
  //   "#1be7ff",
  // ];
  // const myColor = usercolors[Math.floor(Math.random() * usercolors.length)];

  function establishConnection(): void {
    logger.info(
      `Establishing yjs webrtc connection! signal server url: ${getWebRTCSignalServer()}, room id: ${roomId}, key: ${key}`,
    );
    if (!process.client) {
      throw new YatoErDError(
        YatoErDErrorCode.Yjs_WebRTC_Must_Establish_In_Client_Side,
      );
    }

    ydoc.value = new Y.Doc();

    wrtcProvider.value = new WebrtcProvider(roomId, ydoc.value, {
      password: "optional-room-password",
      // Peers using the same signaling server will find each other
      signaling: [signalServerUrl, "ws://localhost:4444"],
      // Maximal number of WebRTC connections.
      maxConns: 20 + Math.floor(Math.random() * 15),
    });
    awareness.value = wrtcProvider.value.awareness;

    // TODO: Add awareness
    awareness.value.setLocalStateField("user", {
      name: "Oni",
    });

    getRoomState();
    subscribe();
  }

  function getRoomState(): void {
    yMapErdState.value = ydoc.value.getMap("erdState");
    yArrayEdgeChanges.value = ydoc.value.getArray("edgeChanges");
    yArrayNodeChanges.value = ydoc.value.getArray("nodeChanges");
  }

  function subscribe(): void {
    yArrayNodeChanges.value.observe((event) => {
      nodeChanges.value = yArrayNodeChanges.value.toArray();
      applyNodeChanges(nodeChanges.value);
    });

    yArrayEdgeChanges.value.observe((event) => {
      edgeChanges.value = yArrayEdgeChanges.value.toArray();
      applyEdgeChanges(edgeChanges.value);
    });
  }

  function unsubscribe(): void {
    if (wrtcProvider.value) {
      logger.info("Disconnecting WebRtc");
      wrtcProvider.value.disconnect();
    }
  }

  function getYMapNodes(): Node[] {
    // TODO: use zod to validate
    const nodes = yMapErdState.value.get("nodes") as Node[];

    if (Array.isArray(nodes)) {
      return nodes;
    }

    logger.warn("YMapNodes is not an array, return empty array");
    return [];
  }

  function getYMapEdges(): Edge[] {
    // TODO: use zod to validate
    const edges = yMapErdState.value.get("edges") as Edge[];

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

  onMounted(() => {
    establishConnection();
    // const setUsername = () => {
    //   awareness.setLocalStateField("user", {
    //     name: inputElement.value,
    //     color: myColor,
    //   });
    // };
    //
    // inputElement?.addEventListener("input", setUsername);
    //
    // awareness.on("change", () => {
    //   // Map each awareness state to a dom-string
    //   const strings = [] as any;
    //   awareness.getStates().forEach((state) => {
    //     console.log(state);
    //     if (state.user) {
    //       strings.push(
    //         `<div style="color:${state.user.color};">• ${state.user.name}</div>`,
    //       );
    //     }
    //     document.querySelector("#users")!.innerHTML = strings.join("");
    //
    //     if (state.cursor) {
    //       // create cursor for all users, except the local user
    //       if (state.cursor.user !== awareness.clientID) {
    //         let cursor = document.querySelector(
    //           `#cursor-${state.cursor.user}`,
    //         ) as HTMLElement;
    //         if (!cursor) {
    //           cursor = document.createElement("div");
    //           cursor.id = `cursor-${state.cursor.user}`;
    //           cursor.style.position = "absolute";
    //           cursor.style.width = "2px";
    //           cursor.style.height = "5px";
    //           cursor.style.backgroundColor = "red";
    //           document.body.appendChild(cursor);
    //         }
    //         cursor.style.left = state.cursor.x + "px";
    //         cursor.style.top = state.cursor.y + "px";
    //       }
    //     }
    //   });
    // });
    //
    // awarenessElement.addEventListener("mousemove", (event) => {
    //   updateCursorPosition(event.clientX, event.clientY);
    // });
    //
    // function updateCursorPosition(x: number, y: number) {
    //   awareness.setLocalStateField("cursor", {
    //     x,
    //     y,
    //     user: awareness.clientID,
    //   });
    // }
  });

  onUnmounted(() => {
    unsubscribe();
  });

  function broadcastEdgeChange(changes: EdgeChange[]): void {
    if (Array.isArray(changes)) {
      yArrayEdgeChanges.value.push(changes);
    }
  }

  function broadcastNodeChange(changes: NodeChange[]): void {
    if (Array.isArray(changes)) {
      // console.log("Broadcast change", changes);
      yArrayNodeChanges.value.push(changes);
    }
  }

  return {
    ydoc,
    awareness,
    wrtcProvider,
    getYMapNodes,
    getYMapEdges,
    establishConnection,
    startAwareness,
    stopAwareness,
    broadcastEdgeChange,
    broadcastNodeChange,
  };
}
