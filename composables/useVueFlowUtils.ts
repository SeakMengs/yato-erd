import {
  useVueFlow,
  type Connection,
  type EdgeRemoveChange,
  type NodeChange,
} from "@vue-flow/core";
import { VUEFLOW_ID } from "~/constants/key";
import { ERD_STATE_AUTO_SAVE_MS } from "~/constants/vueflow";
import type { TableNodeData } from "~/types/diagram/table_node";

export function useVueFlowUtils() {
  const { getConnectedEdges, addNodes, findEdge, setNodes, fitView, viewport } =
    useVueFlow(VUEFLOW_ID);
  const erdState = useErd();

  let autoSaveInternal: NodeJS.Timeout;

  onUnmounted(() => {
    clearInterval(autoSaveInternal);
  });

  function registerAutoSaveErdState(ms: number = ERD_STATE_AUTO_SAVE_MS): void {
    autoSaveInternal = setInterval(() => {
      erdState.saveErdStateToLocalStorage({
        silent: true,
      });
    }, ms);
  }

  // When a collapsible table on the left side bar is clicked make the table node in the diagram show as selected
  // And unselect other tables
  function onCollapsibleClick(nodeId: string) {
    setNodes((nodes) => {
      return nodes.map((n) => ({
        ...n,
        selected: n.id === nodeId ? !n.selected : false,
      }));
    });

    fitView({
      nodes: [nodeId],
      duration: 500, // use this if you want a smooth transition to the node
      padding: 1,
      maxZoom: viewport.value.zoom,
    });
  }

  function addTable(): void {
    logger.info("Adding a new table");

    const newTable = generateTable();
    if (tableHasConflict(newTable)) {
      return addTable();
    }

    addNodes([newTable]);
    // Make new table selected
    onCollapsibleClick(newTable.id);
  }

  function addColumn(nodeId: string): void {
    logger.info(`Adding a new column to table node id: ${nodeId}`);

    try {
      const node = findNodeSafe(nodeId);

      applyTableNodeDataChange(node.id, {
        ...node.data,
        columns: [
          ...node.data!.columns,
          generateColumn(node.data!.columns.length + 1),
        ],
      } as TableNodeData);
    } catch (error) {
      errorHandler(error, "addColumn");
    }
  }

  function removeColumn(nodeId: string, columnId: string): void {
    logger.info(
      `Removing a new column to table node id: ${nodeId}, column id: ${columnId}`,
    );

    try {
      const node = findNodeSafe(nodeId);

      if (node.data!.columns.length === 1) {
        logger.info(
          `Skip remove column in table node id: ${nodeId}, column id: ${columnId} because the table has only one column left`,
        );
        throw new YatoErDError(YatoErDErrorCode.DELETE_LAST_COLUMN_OF_TABLE);
      }

      applyTableNodeDataChange(node.id, {
        ...node.data,
        columns: node.data!.columns.filter((c) => c.columnId != columnId),
      } as TableNodeData);
    } catch (error) {
      errorHandler(error, "removeColumn");
    }
  }

  function handleEdgeSelection(edgeId: string): void {
    const edge = findEdge(edgeId);

    if (!edge) return;
    edge.animated = !edge.selected;
  }

  function isValidEdgeConnection(
    connection: Connection,
    checkExistingEdgeOnColumnSide: boolean,
  ): boolean {
    if (checkExistingEdgeOnColumnSide) {
      if (
        hasExistingEdgeOnColumnSide(
          connection.sourceHandle,
          connection.targetHandle,
        )
      ) {
        return false;
      }
    }

    // Prevent handle to connect with it own node
    return connection.source !== connection.target;
  }

  function getEdgeRemoveChangeFormat(nodeId: string): EdgeRemoveChange[] {
    const connectedEdges = getConnectedEdges(nodeId);
    return connectedEdges.map((e) => {
      return {
        id: e.id,
        source: e.source,
        sourceHandle: e.sourceHandle as string | null,
        target: e.target,
        targetHandle: e.targetHandle as string | null,
        type: "remove",
      };
    });
  }

  function getNodeRemoveChangeFormat(nodeId: string): NodeChange {
    return {
      type: "remove",
      id: nodeId,
    };
  }

  return {
    addColumn,
    removeColumn,
    addTable,
    isValidEdgeConnection,
    handleDefaultEdgeType,
    onCollapsibleClick,
    handleEdgeSelection,
    getEdgeRemoveChangeFormat,
    getNodeRemoveChangeFormat,
    registerAutoSaveErdState,
  };
}
