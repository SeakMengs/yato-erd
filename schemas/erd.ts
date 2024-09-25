import { z } from "zod";
import { NodeType } from "~/types/diagram/node";
import { EdgeType } from "~/types/diagram/edge";

export const columnIndexTypeSchemaEnum = z.enum([
  "Primary key",
  "Unique",
  "None",
]);
export const tableNodeDataColumnSchema = z.object({
  // Bug might occurs if column id is duplicate
  columnId: z
    .string()
    .trim()
    .min(1, {
      message: "Column id is required",
    })
    .catch(() => generateId()),
  columnName: z
    .string()
    .trim()
    .min(1, {
      message: "Column name is required",
    })
    .max(64, {
      message: "Column name must be less than 64 characters",
    }),
  attribute: z.object({
    type: z
      .string()
      .trim()
      .min(1, {
        message: "Column type is required",
      })
      .max(64, {
        message: "Column type must be less than 64 characters",
      }),
    nullable: z
      .boolean({
        invalid_type_error: "Nullable type must be boolean",
      })
      .default(false)
      .optional(),
    autoIncrement: z
      .boolean({
        invalid_type_error: "Auto increment type must be boolean",
      })
      .default(false)
      .optional(),
    defaultValue: z
      .string()
      .max(65535, {
        message: "Default value must be less than 65535 characters",
      })
      .optional(),
    indexType: columnIndexTypeSchemaEnum.default("None").optional(),
  }),
  userComment: z
    .string()
    .max(2000, {
      message: "Comment must be less than 2000 characters",
    })
    .optional(),
});

export const tableNodeDataSchema = z.object({
  tableName: z
    .string()
    .trim()
    .min(1, {
      message: "Table name is required",
    })
    .max(64, {
      message: "Table name must be less than 64 characters",
    }),
  columns: z.array(tableNodeDataColumnSchema),
});

// Use this schema to validate and filter only necessary data we need
// If you want to use type, use CustomTableNode defined in types/diagram/table.
export const tableNodeSchema = z.object({
  // Bug might occurs if id is duplicate
  id: z.string().trim().min(1, {
    message: "Id is required",
  }),
  position: z.object({
    x: z
      .number({
        required_error: "Position x is required",
        invalid_type_error: "Position x type must be number",
      })
      .safe(),
    y: z
      .number({
        required_error: "Position y is required",
        invalid_type_error: "Position y type must be number",
      })
      .safe(),
  }),
  data: tableNodeDataSchema,
  type: z.enum([NodeType.Table]),
});

// Use this schema for validation only as I only want to filter a some object out when read and save state
export const erdEdgeSchema = z.object({
  id: z.string().trim().min(1, {
    message: "Id is required",
  }),
  source: z.string().trim().min(1, {
    message: "Source is required",
  }),
  target: z.string().trim().min(1, {
    message: "Target is required",
  }),
  type: z.enum([EdgeType.ERD]).catch((ctx) => EdgeType.ERD),
  // Technically a table node has two handle, so we have to store the source and target handle
  // in order to allow us to load the state correctly
  sourceHandle: z.string().trim().optional(),
  targetHandle: z.string().trim().optional(),
});

export const tableNodesSchema = z.array(tableNodeSchema);
export const erdEdgesSchema = z.array(erdEdgeSchema);

export const viewportSchema = z.object({
  x: z.coerce.number(),
  y: z.coerce.number(),
  zoom: z.coerce.number(),
});

export const erdStateSchema = z.object({
  nodes: tableNodesSchema,
  edges: erdEdgesSchema,
  viewport: viewportSchema,
});
