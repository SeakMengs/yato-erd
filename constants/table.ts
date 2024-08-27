import type { TableNodeDataColumn } from "~/types/diagram/table_node";

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
