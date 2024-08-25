import type { Node } from "@vue-flow/core";

export type TableNodeData = {
  tableName: string;
  columns: {
    columnName: string;
    attribute: {
      type?: string;
      nullable?: boolean;
      indexType?: "Primary key" | "Unique" | "None";
      autoIncrement?: boolean;
      defaultValue?: boolean;
      usrComment?: string;
    };
  }[];
};

export type TableNodeEvent = {};

export type TableNodeType = "table";

export type CustomTableNode = Node<
  TableNodeData,
  TableNodeEvent,
  TableNodeType
>;
