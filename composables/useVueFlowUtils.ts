import { useVueFlow, type Connection } from "@vue-flow/core";
import type { Position } from "@vueuse/core";
import { VUEFLOW_ID } from "~/constants/key";
import { DEFAULT_COLUMN, DEFAULT_TABLE } from "~/constants/table";
import { NodeType } from "~/types/diagram/node";
import type { CustomTableNode } from "~/types/diagram/table_node";

export function useVueFlowUtils() {
  const {
    getConnectedEdges,
    findNode,
    getNodes,
    addNodes,
    updateNodeData,
    findEdge,
    setNodes,
  } = useVueFlow(VUEFLOW_ID);

  function generateRandomNodePosition(): Position {
    return {
      x: Math.random() * 400,
      y: Math.random() * 400,
    };
  }

  function onCollapsibleClick(nodeId: string) {
    setNodes((nodes) => {
      return nodes.map((n) => {
        if (n.id === nodeId) {
          n.selected = !n.selected;
        } else {
          n.selected = false;
        }
        return n;
      });
    });
  }

  function handleSelectEdge(edgeId: string): void {
    const edge = findEdge(edgeId);

    if (!edge) return;
    edge.animated = !edge.selected;
  }

  function hasExistingEdgeOnColumnSide(
    source: string,
    targetHandle: string | null | undefined,
  ): boolean {
    if (!targetHandle) {
      return false;
    }

    const extractColId = (handle: string | null | undefined): string => {
      // Example targetHandle: "f48e3-left-73149"
      return handle?.split("-")[2] ?? "";
    };

    const targetColId = extractColId(targetHandle);
    const edges = getConnectedEdges(source);
    for (const edge of edges) {
      const colId = extractColId(edge.targetHandle);

      if (targetColId.toLowerCase() === colId.toLowerCase()) {
        return true;
      }
    }

    return false;
  }

  function isValidEdgeConnection(
    connection: Connection,
    checkEdgeSide: boolean = true,
  ): boolean {
    // Call this function in onEdgeUpdate, don't check edge side so that user can drag and move existing edge to the opposite side
    if (checkEdgeSide) {
      if (
        hasExistingEdgeOnColumnSide(
          connection.source,
          connection.targetHandle,
        ) ||
        hasExistingEdgeOnColumnSide(connection.target, connection.sourceHandle)
      ) {
        return false;
      }
    }

    // Prevent handle to connect with it own node
    return connection.source !== connection.target;
  }

  function generateTableName(): string {
    return `Table-${getNodes.value.length + 1}-${generateShortId(3)}`;
  }

  function generateColumn(n: number = 1): typeof DEFAULT_COLUMN {
    return {
      ...DEFAULT_COLUMN,
      columnId: generateShortId(),
      columnName: `column_${n}`,
    };
  }

  function tableHasConflict(table: typeof DEFAULT_TABLE): boolean {
    logger.info(`Check for table node conflict of table id: ${table.id}`);
    return getNodes.value.some((node) => {
      if (node.type !== NodeType.Table) {
        return false;
      }

      return node.id === table.id;
    });
  }

  function addTable(): void {
    try {
      logger.info("Adding a new table");

      const newTable = {
        ...DEFAULT_TABLE,
        id: generateShortId(),
        data: {
          ...DEFAULT_TABLE.data,
          columns: [generateColumn()],
          tableName: generateTableName(),
        },
        position: generateRandomNodePosition(),
      };

      if (tableHasConflict(newTable)) {
        return addTable();
      }

      addNodes([newTable]);
    } catch (error) {
      logger.error(`There was an error in addTable`, error);
    }
  }

  function addColumn(nodeId: string): void {
    try {
      logger.info(`Adding a new column to table node id: ${nodeId}`);

      const node = findNode(nodeId) as CustomTableNode;

      if (!node || node.type !== NodeType.Table) {
        return;
      }

      if (!node.data) {
        logger.error("Add column failed because the node does not have data");
        throw new Error(
          "Add column failed because the node does not have data",
        );
      }

      if (!Array.isArray(node.data.columns)) {
        node.data.columns = [];
      }

      updateNodeData(node.id, {
        ...node.data,
        columns: [
          ...node.data.columns,
          generateColumn(node.data.columns.length + 1),
        ],
      });
    } catch (error) {
      logger.error(`There was an error in addColumn`, error);
    }
  }

  function removeColumn(nodeId: string, columnId: string): void {
    try {
      logger.info(
        `Removing a new column to table node id: ${nodeId}, column id: ${columnId}`,
      );

      const node = findNode(nodeId) as CustomTableNode;

      if (!node || node.type !== NodeType.Table) {
        return;
      }

      if (!node.data) {
        logger.error(
          "Remove column failed because the node does not have data",
        );
        throw new Error(
          "Remove column failed because the node does not have data",
        );
      }

      if (!Array.isArray(node.data.columns)) {
        node.data.columns = [];
      }

      if (node.data.columns.length === 1) {
        logger.info(
          `Skip remove column in table node id: ${nodeId}, column id: ${columnId} because the table has only one column left`,
        );
        return;
      }

      updateNodeData(node.id, {
        ...node.data,
        columns: node.data.columns.filter((c) => c.columnId != columnId),
      });
    } catch (error) {
      logger.error(`There was an error in removeColumn`, error);
    }
  }

  return {
    // Export for unit test
    tableHasConflict,
    // End of export for unit test
    addColumn,
    removeColumn,
    addTable,
    isValidEdgeConnection,
    handleDefaultEdgeType,
    onCollapsibleClick,
    handleSelectEdge,
  };
}
