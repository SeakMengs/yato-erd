import { useVueFlow, type Edge } from "@vue-flow/core";
import { defineStore } from "pinia";
import type { CustomTableNode } from "~/types/diagram/table_node";
import { ERD_STATE_ID, VUEFLOW_ID } from "~/constants/key";
import { erdStateSchema } from "~/schemas/erd";
import { toast } from "~/components/ui/toast";

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
        throw new YatoErDError(
          YatoErDErrorCode.Get_ERD_State_From_Local_Storage,
        );
      }
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
        toast({
          description: "ERD state has been saved",
        });
      } catch (error) {
        logger.error(`There was an error while saving erd state`, error);
        throw new Error("Failed to save erd state to local storage");
      }
    },
    fetchErdState(): void {
      logger.info("Fetching erd state from local storage");
      try {
        const state = this.getErdStateFromLocalStorage();

        this.nodes = state.nodes;
        this.edges = state.edges;

        toast({
          description: "ERD state has been loaded",
        });
      } catch (error) {
        errorHandler(error);
      }
    },
  },
});
