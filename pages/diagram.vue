<script setup lang="ts">
import { Controls } from "@vue-flow/controls";
import {
  ErrorCode,
  isErrorOfType,
  useVueFlow,
  VueFlow,
  VueFlowError,
  type EdgeTypesObject,
} from "@vue-flow/core";
import ThemeButton from "~/components/ThemeButton.vue";
import ERDEdge from "~/components/diagram/ERDEdge.vue";
import { VUEFLOW_ID } from "~/constants/key";
import { THEME } from "~/types/theme";

const colorMode = useColorMode();
// FIXME: check what if user use system mode? they would get unwanted colorscheme in the diagram
const dark = computed(() => colorMode.preference === THEME.DARK);

const { onEdgeUpdate, onConnect, onEdgesChange, onNodesChange } =
  useVueFlowEvents();
const { isDeleteNodeDialogOpen, onIsDeleteNodeDialogOpenChange } =
  useRemoveNodeDiloag();
const { onError } = useVueFlow(VUEFLOW_ID);

onError((error: VueFlowError) => {
  errorHandler(error);
});

const edgeTypes = {
  default: markRaw(ERDEdge),
  erd: markRaw(ERDEdge),
} satisfies EdgeTypesObject;

const erdState = useErd();

onMounted(() => {
  erdState.fetchErdState();
});
</script>

<template>
  <ThemeButton />
  <Button variant="outline" @click="erdState.saveErdStateToLocalStorage"
    >Save state
  </Button>
  <ClientOnly>
    <DiagramConfirmDeleteNodeDialog
      v-bind="isDeleteNodeDialogOpen"
      v-on:open-change="onIsDeleteNodeDialogOpenChange"
    />
    <ResizablePanelGroup
      id="handle-group-1"
      direction="horizontal"
      class="!h-[calc(100%-48px)] rounded-lg border"
    >
      <ResizablePanel id="handle-panel-1" :default-size="20">
        <DiagramLeftSideBar />
      </ResizablePanel>
      <ResizableHandle id="handle-handle-1" with-handle />
      <ResizablePanel id="handle-panel-2" :default-size="80">
        <VueFlow
          :id="VUEFLOW_ID"
          :class="
            cn({
              dark: dark,
            })
          "
          :nodes="erdState.getNodes"
          :edges="erdState.getEdges"
          :edges-updatable="true"
          :edge-types="edgeTypes"
          :apply-default="false"
          :connection-radius="70"
          :auto-connect="true"
          :only-render-visible-elements="false"
          @error="errorHandler"
          @edge-update="onEdgeUpdate"
          @connect="onConnect"
          @nodes-change="onNodesChange"
          @edges-change="onEdgesChange"
        >
          <!-- Subjected to "#note-${node-type}" in this case, my custom node is called "table" -->
          <template #node-table="erdNodeprops">
            <DiagramTableNode
              v-bind="{
                ...erdNodeprops,
                tableNodeDataWithNodeId: {
                  tableNodeId: erdNodeprops.id,
                  tableName: erdNodeprops.data.tableName,
                  columns: erdNodeprops.data.columns,
                },
              }"
            />
          </template>
          <!-- Default connection line when user drag the line from handle -->
          <template #connection-line="lineProps">
            <DiagramConnectionLine v-bind="lineProps" />
          </template>
          <template #edge-erd="edgeErdProps">
            <DiagramERDEdge v-bind="edgeErdProps" />
          </template>
          <!-- <MiniMap pannable zoomable /> -->
          <Controls position="bottom-right" />
        </VueFlow>
      </ResizablePanel>
    </ResizablePanelGroup>
    <!-- <div class="flex !h-[calc(100%-48px)]"> -->
    <!-- </div> -->
  </ClientOnly>
</template>

<style>
@import "@vue-flow/core/dist/style.css";

/* this contains the default theme, these are optional styles */
@import "@vue-flow/core/dist/theme-default.css";

/* Comment this out if doesn't use */
@import "@vue-flow/minimap/dist/style.css";
@import "@vue-flow/controls/dist/style.css";
</style>
