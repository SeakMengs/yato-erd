import type { Node } from "@vue-flow/core";
import type { NodeType } from "./node";

export type TableNodeDataColumn = {
  columnName: string;
  attribute: {
    type?: string;
    nullable?: boolean;
    indexType?: "Primary key" | "Unique" | "None";
    autoIncrement?: boolean;
    defaultValue?: string;
    usrComment?: string;
  };
};

export type TableNodeData = {
  tableName: string;
  columns: TableNodeDataColumn[];
};

export type TableNodeDataWithNodeId = TableNodeData & {
  id: string;
};

export type TableNodeEvent = {};

export type TableNodeType = NodeType.Table;

export type CustomTableNode = Node<
  TableNodeData,
  TableNodeEvent,
  TableNodeType
>;
