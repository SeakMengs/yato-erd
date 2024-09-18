import type { Node, NodeProps } from "@vue-flow/core";
import type { NodeType } from "./node";
import { z } from "zod";
import { tableNodeDataColumnSchema, tableNodeDataSchema } from "~/schemas/erd";

export type TableNodeDataColumn = z.infer<typeof tableNodeDataColumnSchema>;
export type TableNodeData = z.infer<typeof tableNodeDataSchema>;

export type TableNodeDataWithNodeId = TableNodeData & {
  tableNodeId: string;
};

export type TableNodeEvent = {};

export type TableNodeType = NodeType.Table;

export type CustomTableNodeProps = NodeProps<TableNodeData, TableNodeEvent>;

export type CustomTableNode = Node<
  TableNodeData,
  TableNodeEvent,
  TableNodeType
>;
