import { NodeType } from "~/types/diagram/node";
import type {
  CustomTableNode,
  TableNodeDataColumn,
} from "~/types/diagram/table_node";

// Becareful with reference, make sure to deep clone the object when assigning the variable to somewhere that has user input
export const DEFAULT_COLUMN = {
  columnName: "",
  attribute: {
    type: "bigint",
    nullable: true,
    indexType: "None",
    defaultValue: "",
    autoIncrement: false,
  },
} satisfies TableNodeDataColumn;

export const DEFAULT_TABLE = {
  id: "",
  position: { x: 0, y: 0 },
  data: {
    tableName: "",
    columns: [
      {
        columnName: "column-1",
        attribute: {},
      },
    ],
  },
  type: NodeType.Table,
} satisfies CustomTableNode;
