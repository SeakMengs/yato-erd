import type { Connection } from "@vue-flow/core";
import type { DEFAULT_TABLE } from "~/constants/table";
import { NodeType } from "~/types/diagram/node";

export const MOCK_TABLE_NODES = [
  {
    id: "22b5d",
    position: { x: 118.89712262348161, y: 128.342550976332 },
    data: {
      tableName: "Table-mock-1-ee1",
      columns: [
        {
          columnId: "bc986",
          columnName: "mock-1-column_1",
          attribute: {
            type: "bigint",
            nullable: true,
            autoIncrement: false,
            defaultValue: "",
            indexType: "None",
          },
        },
      ],
    },
    type: NodeType.Table,
  },
  {
    id: "b4657",
    position: { x: 422.7886424987952, y: 274.24916006715296 },
    data: {
      tableName: "Table-mock-2-146",
      columns: [
        {
          columnId: "797e2",
          columnName: "mock-2-column_1",
          attribute: {
            type: "varchar",
            nullable: true,
            autoIncrement: false,
            defaultValue: "",
            indexType: "None",
          },
        },
      ],
    },
    type: NodeType.Table,
  },
] satisfies (typeof DEFAULT_TABLE)[];

export const MOCK_CONFLICT_TABLE = {
  ...MOCK_TABLE_NODES[0],
};

export const MOCK_NO_CONFLICT_TABLE = {
  ...MOCK_TABLE_NODES[0],
  id: "c1234",
  data: {
    ...MOCK_TABLE_NODES[0].data,
    tableName: "NoConflictTable",
  },
};

export const INVALID_EDGE_CONNECTION = {
  source: "22b5d",
  target: "22b5d",
  sourceHandle: null,
  targetHandle: null,
} satisfies Connection;

export const VALID_EDGE_CONNECTION = {
  source: "22b5d",
  target: "b4657",
  sourceHandle: null,
  targetHandle: null,
} satisfies Connection;

export const REMOVE_TABLE_NODE_ID = MOCK_TABLE_NODES[0].id;
