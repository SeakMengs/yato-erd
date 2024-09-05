import { useVueFlow, type Edge } from "@vue-flow/core";
import { defineStore } from "pinia";
import type { CustomTableNode } from "~/types/diagram/table_node";
import { z } from "zod";
import { NodeType } from "~/types/diagram/node";
import { EdgeType } from "~/types/diagram/edge";
import { ERD_STATE_ID, VUEFLOW_ID } from "~/constants/key";

const columnIndexTypeSchemaEnum = z.enum(["Primary key", "Unique", "None"]);
export const tableNodeDataColumnSchema = z.object({
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
      .max(64, {
        message: "Column type must be less than 64 characters",
      })
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

// Use this schema to validate and filter only necessary data we need
// If you want to use type, use CustomTableNode defined in types/diagram/table.
export const tableNodeSchema = z.object({
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

export const erdStateSchema = z.object({
  nodes: z.array(tableNodeSchema),
  edges: z.array(erdEdgeSchema),
});

// Purposely create this type to ensure any change will reflect to vue flow's node and edge type
type ERDState = {
  nodes: CustomTableNode[];
  edges: Edge[];
};

export const useErd = defineStore(ERD_STATE_ID, {
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
    validateErdState(state: any): ERDState {
      const result = erdStateSchema.safeParse(state);
      logger.info("validated", result);
      if (!result.success) {
        return {
          nodes: [],
          edges: [],
        };
        // TODO: better error handling than this lol
        // throw Error(result.error.toString());
      }

      return result.data;
    },
    getErdStateFromLocalStorage(): ERDState {
      try {
        logger.info("Get erd state from local storage");
        const state = JSON.parse(localStorage.getItem("erd-state") ?? "{}");
        return this.validateErdState(state);
      } catch (error) {
        logger.error(
          `There was an error in getErdStateFromLocalStorage`,
          error,
        );
      }

      return {
        nodes: [],
        edges: [],
      };
    },
    saveErdStateToLocalStorage(): void {
      const { toObject } = useVueFlow(VUEFLOW_ID);

      try {
        logger.info("Saving erd state to local storage");
        const data = toObject();
        localStorage.setItem(
          "erd-state",
          JSON.stringify(
            this.validateErdState({
              nodes: data.nodes,
              edges: data.edges,
            }),
          ),
        );
      } catch (error) {
        logger.error(`There was an error while saving erd state`, error);
        throw new Error("Failed to save erd state to local storage");
      }
    },
    fetchErdState(): void {
      logger.info("Fetching erd state from local storage");
      const state = this.getErdStateFromLocalStorage();

      this.nodes = state.nodes;
      this.edges = state.edges;
    },
  },
});
