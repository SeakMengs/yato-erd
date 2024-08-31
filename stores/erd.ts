import type { Edge } from "@vue-flow/core";
import { defineStore } from "pinia";
import type { TableNode } from "~/types/diagram/table_node";
import z from "zod";

const columnIndexTypeSchemaEnum = z.enum(["Primary key", "Unique", "None"]);
export const tableNodeDataColumnSchema = z.object({
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
      .max(64, {
        message: "Column type must be less than 64 characters",
      })
      .default("int")
      .optional(),
    nullable: z
      .boolean({
        invalid_type_error: "Nullable type must be boolean",
      })
      .default(false)
      .optional(),
    autoIncrement: z
      .boolean({
        invalid_type_error: "Nullable type must be boolean",
      })
      .default(false)
      .optional(),
    defaultValue: z.string().trim().optional(),
    indexType: columnIndexTypeSchemaEnum.default("None").optional(),
  }),
  userComment: z
    .string()
    .trim()
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

export const tableNodeSchema = z.object({});

type ERDState = {
  nodes: TableNode[];
  edges: Edge[];
};

const useErd = defineStore("erd-state", {
  state: (): ERDState => ({
    nodes: [],
    edges: [],
  }),
  getters: {
    getNodes(): ERDState["nodes"] {
      return this.nodes;
    },
    getEdges(): ERDState["edges"] {
      return this.edges;
    },
  },
  actions: {
    getNodesFromLocalStorage(): ERDState["nodes"] {
      const nodes = localStorage.getItem("erd-state");
      return nodes as any;
    },
  },
});
