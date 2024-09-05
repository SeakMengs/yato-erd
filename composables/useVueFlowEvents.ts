import {
  useVueFlow,
  type Connection,
  type Edge,
  type EdgeChange,
  type GraphEdge,
  type NodeChange,
} from "@vue-flow/core";
import { VUEFLOW_ID } from "~/constants/key";

export function useVueFlowEvents() {
  const { updateEdge, applyEdgeChanges, applyNodeChanges, addEdges } =
    useVueFlow(VUEFLOW_ID);
  const { confirm, nodeId } = useRemoveNodeDiloag();
  const pendingNodeRemoval = computed<boolean>(() => !!nodeId.value);
  const {
    getEdgeRemoveChangeFormat,
    handleEdgeSelection,
    isValidEdgeConnection,
  } = useVueFlowUtils();

  // basically for user to move the connected edge to other handle
  function onEdgeUpdate({
    edge,
    connection,
  }: {
    edge: GraphEdge;
    connection: Connection;
  }): void {
    if (!isValidEdgeConnection(connection, false)) return;

    updateEdge(edge, connection);
  }

  function onConnect(params: Edge | Connection): void {
    addEdges({ ...params });
  }

  async function onEdgesChange(changes: EdgeChange[]): Promise<void> {
    const nextChanges: EdgeChange[] = [];

    for (const c of changes) {
      switch (c.type) {
        case "select":
          handleEdgeSelection(c.id);
          nextChanges.push(c);
          break;
        case "add":
          c.item.type = handleDefaultEdgeType(c.item.type);
          nextChanges.push(c);
          break;
        case "remove":
          await nextTick();
          if (pendingNodeRemoval.value) {
            break;
          }

          nextChanges.push(c);
          break;
        default:
          nextChanges.push(c);
      }
    }

    applyEdgeChanges(nextChanges);
  }

  async function onNodesChange(changes: NodeChange[]): Promise<void> {
    const nextChanges: NodeChange[] = [];

    for (const c of changes) {
      switch (c.type) {
        case "remove":
          const confirmed = await confirm(c.id);

          if (confirmed) {
            await onEdgesChange(getEdgeRemoveChangeFormat(c.id));
            nextChanges.push(c);
            break;
          }

          break;
        default:
          nextChanges.push(c);
      }
    }

    applyNodeChanges(nextChanges);
  }

  return {
    onEdgesChange,
    onConnect,
    onEdgeUpdate,
    onNodesChange,
  };
}
