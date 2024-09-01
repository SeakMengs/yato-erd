import type { Edge } from "@vue-flow/core";
import { EdgeType } from "~/types/diagram/edge";
import { NodeType } from "~/types/diagram/node";
import type { CustomTableNode } from "~/types/diagram/table_node";

const nodes = ref<CustomTableNode[]>([
  {
    id: "1",
    position: { x: 100, y: 100 },
    data: {
      tableName: "Node 1",
      columns: [
        {
          columnName: "Lol",
          attribute: {},
        },
      ],
    },
    type: NodeType.Table,
  },
  {
    id: "2",
    position: { x: 250, y: 250 },
    data: {
      tableName: "Node 2",
      columns: [
        {
          columnName: "Lolc1",
          attribute: {},
        },
        {
          columnName: "Lolc2",
          attribute: {},
        },
      ],
    },
    type: NodeType.Table,
  },
]);

const edges = ref<Edge[]>([
  {
    id: "e1->2",
    source: "1",
    type: EdgeType.ERD,
    target: "2",
  },
]);
