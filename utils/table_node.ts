import { useVueFlow } from "@vue-flow/core";
import type { Position } from "@vueuse/core";
import { VUEFLOW_ID } from "~/constants/key";
import { DEFAULT_COLUMN, DEFAULT_TABLE } from "~/constants/table";
import { NodeType } from "~/types/diagram/node";
import type { CustomTableNode } from "~/types/diagram/table_node";

const { getNodes, findNode } = useVueFlow(VUEFLOW_ID);

function generateRandomNodePosition(): Position {
  return {
    x: Math.random() * 400,
    y: Math.random() * 400,
  };
}

function generateTableName(n: number): string {
  return `Table-${n + 1}-${generateId()}`;
}

export function generateColumn(n: number): typeof DEFAULT_COLUMN {
  return {
    ...DEFAULT_COLUMN,
    columnId: generateId(),
    columnName: `column_${n}`,
  };
}

export function generateTable(): typeof DEFAULT_TABLE {
  return {
    ...DEFAULT_TABLE,
    id: generateId(),
    data: {
      ...DEFAULT_TABLE.data,
      columns: [generateColumn(1)],
      tableName: generateTableName(getNodes.value.length),
    },
    position: generateRandomNodePosition(),
  };
}

export function tableHasConflict(table: typeof DEFAULT_TABLE): boolean {
  logger.info(`Check for table node conflict of table id: ${table.id}`);

  return getNodes.value.some((node) => {
    if (node.type !== NodeType.Table) {
      return false;
    }

    return node.id === table.id;
  });
}

export function validateNode(nodeId: string): CustomTableNode {
  const node = findNode(nodeId) as CustomTableNode;

  if (!node) throw new YatoErDError(YatoErDErrorCode.Node_Not_Found);

  if (node.type !== NodeType.Table)
    throw new YatoErDError(YatoErDErrorCode.Node_Type_Not_Table);

  if (!node.data) {
    logger.error("Operation failed because the node does not have data");
    throw new YatoErDError(YatoErDErrorCode.Node_Does_Not_Have_Data_Object);
  }

  if (!Array.isArray(node.data.columns)) node.data.columns = [];

  return node;
}