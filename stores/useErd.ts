import { useVueFlow, type Edge, type ViewportTransform } from "@vue-flow/core";
import { defineStore } from "pinia";
import type { CustomTableNode } from "~/types/diagram/table_node";
import { ERD_STATE_ID, VUEFLOW_ID } from "~/constants/key";
import { erdStateSchema } from "~/schemas/erd";
import { toast } from "~/components/ui/toast";
import { DEFAULT_ERD_STATE, ERD_STATE_AUTO_SAVE_MS } from "~/constants/vueflow";
import isEqual from "lodash/isEqual";

// Purposely create this type to ensure any change will reflect to vue flow's node and edge type
export type ERDState = {
  nodes: CustomTableNode[];
  edges: Edge[];
  viewport: ViewportTransform;
};

export const useErd = defineStore(ERD_STATE_ID, () => {
  const state = ref<ERDState>(structuredClone(DEFAULT_ERD_STATE));
  const { toObject } = useVueFlow(VUEFLOW_ID);

  let autoSaveInternal: NodeJS.Timeout;

  onBeforeUnmount(() => {
    clearInterval(autoSaveInternal);
  });

  function setState(s: ERDState): void {
    state.value = s;
  }

  function registerAutoSaveErdState(ms: number = ERD_STATE_AUTO_SAVE_MS): void {
    autoSaveInternal = setInterval(() => {
      saveErdStateToLocalStorage({
        silent: true,
      });
    }, ms);
  }

  function validateErdState(state: any): ERDState {
    const result = erdStateSchema.safeParse(state);
    logger.info(`Erd state validated and is valid: ${result.success}`);
    if (!result.success) {
      throw new YatoErDError(YatoErDErrorCode.ERD_STATE_IS_INVALID);
    }

    return result.data;
  }

  function getErdStateFromLocalStorage(): ERDState {
    try {
      logger.info("Get erd state from local storage");
      const state = localStorage.getItem("erd-state");

      if (!state) {
        return structuredClone(DEFAULT_ERD_STATE);
      }

      const parsed = JSON.parse(state);
      return validateErdState(parsed);
    } catch (error) {
      logger.error(`There was an error in getErdStateFromLocalStorage`, error);
      throw new YatoErDError(YatoErDErrorCode.GET_ERD_STATE_FROM_LOCAL_STORAGE);
    }
  }

  // State is handled by vue flow, so when we want to save, export, call this function to sync this store
  function syncStoreWithVueflow(): void {
    const data = toObject();

    state.value = validateErdState({
      nodes: data.nodes as CustomTableNode[],
      edges: data.edges as Edge[],
      viewport: data.viewport,
    });
  }

  function saveErdStateToLocalStorage(options: { silent?: boolean }): void {
    try {
      logger.info("Saving erd state to local storage");
      syncStoreWithVueflow();

      if (!isEqual(state.value, getErdStateFromLocalStorage())) {
        // The sync store with vue flow already validated the erd
        localStorage.setItem("erd-state", JSON.stringify(state.value));
      } else {
        logger.info(
          "Local state and current diagram state is the same, skip saving erd state",
        );
      }

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
    setState,
    registerAutoSaveErdState,
    fetchErdState,
    syncStoreWithVueflow,
    saveErdStateToLocalStorage,
    validateErdState,
  };
});
