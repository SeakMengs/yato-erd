import type { NodeChange } from "@vue-flow/core";

export enum NodeType {
  Table = "table",
}

export type NodeConfirmedRemoveChange = {
  id: string;
  type: "confirmed-remove";
};

export type CustomNodeChange = NodeChange | NodeConfirmedRemoveChange;
