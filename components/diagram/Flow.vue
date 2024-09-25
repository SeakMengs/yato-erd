<script setup lang="ts">
import { Controls } from "@vue-flow/controls";
import {
  useVueFlow,
  VueFlow,
  VueFlowError,
  type EdgeTypesObject,
} from "@vue-flow/core";
import ERDEdge from "~/components/diagram/ERDEdge.vue";
import { VUEFLOW_ID } from "~/constants/key";
import { THEME } from "~/types/theme";

const colorMode = useColorMode();
const dark = computed(() => colorMode.preference === THEME.DARK);

const { onEdgeUpdate, onConnect, onEdgesChange, onNodesChange } =
  useVueFlowEvents();
const { onError } = useVueFlow(VUEFLOW_ID);
// const { onMouseMove } = useVueFlowMousePosition();

onError((error: VueFlowError) => {
  errorHandler(error, "nuxt's onError");
});

const edgeTypes = {
  default: markRaw(ERDEdge),
  erd: markRaw(ERDEdge),
} satisfies EdgeTypesObject;

const erdState = useErd();
</script>

<template>
  <ClientOnly>
    <!-- @mousemove="onMouseMove" -->
    <VueFlow
      :id="VUEFLOW_ID"
      :class="
        cn('h-full w-full', {
          dark: dark,
        })
      "
      :nodes="erdState.state.nodes"
      :edges="erdState.state.edges"
      :edges-updatable="true"
      :edge-types="edgeTypes"
      :apply-default="false"
      :connection-radius="70"
      :auto-connect="true"
      :only-render-visible-elements="false"
      :max-zoom="2"
      :min-zoom="0.5"
      @error="errorHandler"
      @edge-update="onEdgeUpdate"
      @connect="onConnect"
      @nodes-change="onNodesChange"
      @edges-change="onEdgesChange"
    >
      <!-- Subjected to "#note-${node-type}" in this case, my custom node is called "table" -->
      <template #node-table="tableNodeProps">
        <DiagramTableNode v-bind="tableNodeProps" />
      </template>
      <!-- Default connection line when user drag the line from handle -->
      <template #connection-line="lineProps">
        <DiagramConnectionLine v-bind="lineProps" />
      </template>
      <template #edge-erd="edgeErdProps">
        <DiagramERDEdge v-bind="edgeErdProps" />
      </template>
      <!-- <MiniMap pannable zoomable /> -->
      <Controls
        position="bottom-right"
        :show-zoom="false"
        :show-fit-view="false"
        :show-interactive="false"
      >
        <DiagramControlSettings />
      </Controls>
    </VueFlow>
  </ClientOnly>
</template>

<style>
@import "@vue-flow/core/dist/style.css";

/* this contains the default theme, these are optional styles */
@import "@vue-flow/core/dist/theme-default.css";

/* Comment this out if doesn't use */
@import "@vue-flow/minimap/dist/style.css";
/* @import "@vue-flow/controls/dist/style.css"; */
</style>
