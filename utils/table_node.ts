import { useVueFlow, type Node } from "@vue-flow/core";
import type { Position } from "@vueuse/core";
import { VUEFLOW_ID } from "~/constants/key";
import { DEFAULT_COLUMN, DEFAULT_TABLE } from "~/constants/table";
import { tableNodesSchema } from "~/schemas/erd";
import { NodeType } from "~/types/diagram/node";
import type {
  CustomTableNode,
  TableNodeData,
  TableNodeDataColumn,
} from "~/types/diagram/table_node";

const { getNodes, findNode, updateNodeData } = useVueFlow(VUEFLOW_ID);

function generateRandomNodePosition(): Position {
  return {
    x: Math.random() * 400,
    y: Math.random() * 400,
  };
}

function generateTableName(n: number): string {
  return `Table-${n + 1}-${generateId()}`;
}

export function generateColumn(n: number): TableNodeDataColumn {
  return {
    ...DEFAULT_COLUMN,
    attribute: {
      ...DEFAULT_COLUMN.attribute,
      nullable: n !== 1,
      indexType: n === 1 ? "Primary key" : DEFAULT_COLUMN.attribute.indexType,
      autoIncrement: n === 1,
    },
    columnId: generateId(),
    columnName: n === 1 ? `id` : `column_${n}`,
  };
}

export function generateTable(): CustomTableNode {
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

export function applyTableNodeDataChange(
  nodeId: string,
  // TODO: write better type
  data: TableNodeData,
): void {
  updateNodeData(nodeId, data);
}

export function tableHasConflict(table: CustomTableNode): boolean {
  logger.info(`Check for table node conflict of table id: ${table.id}`);

  return getNodes.value.some((node) => {
    if (node.type !== NodeType.Table) {
      return false;
    }

    return node.id === table.id;
  });
}

export function findNodeSafe(nodeId: string): CustomTableNode {
  const node = findNode(nodeId) as CustomTableNode;

  if (!node) throw new YatoErDError(YatoErDErrorCode.F_NODE_NOT_FOUND);

  if (node.type !== NodeType.Table)
    throw new YatoErDError(YatoErDErrorCode.NODE_TYPE_NOT_TABLE);

  if (!node.data) {
    logger.error("Operation failed because the node does not have data");
    throw new YatoErDError(YatoErDErrorCode.NODE_DOES_NOT_HAVE_DATA_OBJECT);
  }

  if (!Array.isArray(node.data.columns)) node.data.columns = [];

  return node;
}

export function validateNodes(data: unknown): Node[] {
  const result = tableNodesSchema.safeParse(data);
  return (result.success ? result.data : []) as unknown as Node[];
}
