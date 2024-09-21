import { useVueFlow, type Edge, type ViewportTransform } from "@vue-flow/core";
import { defineStore } from "pinia";
import type { CustomTableNode } from "~/types/diagram/table_node";
import { ERD_STATE_ID, VUEFLOW_ID } from "~/constants/key";
import { erdStateSchema } from "~/schemas/erd";
import { toast } from "~/components/ui/toast";
import { ERD_STATE_AUTO_SAVE_MS } from "~/constants/vueflow";

// Purposely create this type to ensure any change will reflect to vue flow's node and edge type
type ERDState = {
  nodes: CustomTableNode[];
  edges: Edge[];
  viewport: ViewportTransform;
};

export const useErd = defineStore(ERD_STATE_ID, () => {
  const state = ref<ERDState>({
    nodes: [],
    edges: [],
    viewport: {
      x: 0,
      y: 0,
      zoom: 1,
    },
  });

  let autoSaveInternal: NodeJS.Timeout;

  onBeforeUnmount(() => {
    clearInterval(autoSaveInternal);
  });

  function registerAutoSaveErdState(ms: number = ERD_STATE_AUTO_SAVE_MS): void {
    autoSaveInternal = setInterval(() => {
      saveErdStateToLocalStorage({
        silent: true,
      });
    }, ms);
  }

  function validateErdState(state: any): ERDState {
    const result = erdStateSchema.safeParse(state);
    logger.info("validated", result);
    if (!result.success) {
      throw new YatoErDError(YatoErDErrorCode.ERD_STATE_IS_INVALID);
    }

    return result.data;
  }

  function getErdStateFromLocalStorage(): ERDState {
    try {
      logger.info("Get erd state from local storage");
      const state = JSON.parse(localStorage.getItem("erd-state") ?? "{}");
      return validateErdState(state);
    } catch (error) {
      logger.error(`There was an error in getErdStateFromLocalStorage`, error);
      throw new YatoErDError(YatoErDErrorCode.GET_ERD_STATE_FROM_LOCAL_STORAGE);
    }
  }

  function saveErdStateToLocalStorage(options: { silent?: boolean }): void {
    const { toObject } = useVueFlow(VUEFLOW_ID);

    try {
      logger.info("Saving erd state to local storage");
      const data = toObject();
      localStorage.setItem(
        "erd-state",
        JSON.stringify(
          validateErdState({
            nodes: data.nodes,
            edges: data.edges,
            viewport: data.viewport,
          }),
        ),
      );

      if (!options.silent) {
        toast({
          description: "ERD state has been saved",
        });
      }
    } catch (error) {
      throw new YatoErDError(YatoErDErrorCode.SAVE_ERD_STATE_TO_LOCAL_STORAGE);
    }
  }

  function fetchErdState(): void {
    logger.info("Fetching erd state from local storage");
    try {
      state.value = getErdStateFromLocalStorage();

      toast({
        description: "ERD state has been loaded",
      });
    } catch (error) {
      errorHandler(error, "fetchErdState");
    }
  }

  return {
    state,
    registerAutoSaveErdState,
    fetchErdState,
    saveErdStateToLocalStorage,
    validateErdState,
  };
});
