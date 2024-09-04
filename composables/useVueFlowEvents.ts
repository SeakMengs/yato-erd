import {
  useVueFlow,
  type Connection,
  type Edge,
  type EdgeChange,
  type EdgeRemoveChange,
  type GraphEdge,
  type NodeChange,
} from "@vue-flow/core";
import { VUEFLOW_ID } from "~/constants/key";
import type {
  CustomNodeChange,
  NodeConfirmedRemoveChange,
} from "~/types/diagram/node";

export function useVueFlowEvents() {
  const {
    getConnectedEdges,
    updateEdge,
    applyEdgeChanges,
    applyNodeChanges,
    addEdges,
  } = useVueFlow(VUEFLOW_ID);
  const { onRemoveNodeChange, isDeleteNodeDialogOpen } = useRemoveNodeDiloag();
  const { handleSelectEdge, isValidEdgeConnection } = useVueFlowUtils();

  // Technically this is not an event however since we need to use some function here, we cannot put in useVueFlowUtils because import recursion
  function removeTableByNodeId(nodeId: string) {
    logger.info(`Deleting a table node id: ${nodeId}`);

    const connectedEdges = getConnectedEdges(nodeId);
    if (connectedEdges.length > 0) {
      const edgeChanges = connectedEdges.map((e) => {
        return {
          id: e.id,
          source: e.source,
          sourceHandle: e.sourceHandle as string | null,
          target: e.target,
          targetHandle: e.targetHandle as string | null,
          type: "remove",
        };
      }) satisfies EdgeRemoveChange[];
      onEdgesChange(edgeChanges);
    }

    const nodeChange = {
      type: "confirmed-remove",
      id: nodeId,
    } satisfies NodeConfirmedRemoveChange;
    onNodesChange([nodeChange]);
  }

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
          handleSelectEdge(c.id);
          nextChanges.push(c);
          break;
        case "add":
          c.item.type = handleDefaultEdgeType(c.item.type);
          nextChanges.push(c);
          break;
        case "remove":
          // Somehow when calling the two console.log, it show different state, and the solution is to wait for nextTick from vue
          // Read more for reference from the docs: https://vuejs.org/api/general.html#nexttick
          // console.log(isDeleteNodeDialogOpen);
          // console.log(isDeleteNodeDialogOpen.open);
          await nextTick();

          // If there is a pop up asking user to confirm delete node, then don't delete edge yet because user might cancel operation
          if (isDeleteNodeDialogOpen.open) {
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

  async function onNodesChange(changes: CustomNodeChange[]): Promise<void> {
    const nextChanges: NodeChange[] = [];

    for (const c of changes) {
      switch (c.type) {
        case "remove":
          // Ask user for confirmation before deleting the table node
          onRemoveNodeChange(c.id);
          break;
        case "confirmed-remove":
          // After user confirm remove, this function will be call again with change type 'confirmed-remove'
          nextChanges.push({
            ...c,
            type: "remove",
          });
          break;
        default:
          nextChanges.push(c as NodeChange);
      }
    }

    applyNodeChanges(nextChanges);
  }

  return {
    onEdgesChange,
    onConnect,
    onEdgeUpdate,
    onNodesChange,
    removeTableByNodeId,
  };
}
