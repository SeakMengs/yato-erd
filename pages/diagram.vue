<script setup lang="ts">
import {
  VueFlow,
  useVueFlow,
  type NodeChange,
  type Edge,
  type GraphEdge,
  type Connection,
  type EdgeTypesObject,
  type EdgeChange,
} from "@vue-flow/core";
import { MiniMap } from "@vue-flow/minimap";
import { Controls } from "@vue-flow/controls";
import ThemeButton from "~/components/ThemeButton.vue";
import ERDEdge from "~/components/diagram/ERDEdge.vue";
import { THEME } from "~/types/theme";
import { VUEFLOW_ID } from "~/constants/key";

const {
  applyNodeChanges,
  applyEdgeChanges,
  addEdges,
  updateEdge,
  findEdge,
  getNodes,
  getEdges,
} = useVueFlow(VUEFLOW_ID);
const { isValidEdgeConnection } = useVueFlowUtils();

const colorMode = useColorMode();
// FIXME: check what if user use system mode? they would get unwanted colorscheme in the diagram
const dark = computed(() => colorMode.preference === THEME.DARK);

const edgeTypes = {
  default: markRaw(ERDEdge),
  erd: markRaw(ERDEdge),
} satisfies EdgeTypesObject;

const erdState = useErd();

onMounted(() => {
  erdState.fetchErdState();
});

// basically for user to move the connected edge to other handle
function onEdgeUpdate({
  edge,
  connection,
}: {
  edge: GraphEdge;
  connection: Connection;
}): void {
  if (!isValidEdgeConnection(connection, false)) return;

  updateEdge(edge, connection);
}

function onConnect(params: Edge | Connection): void {
  addEdges({ ...params });
}

function onNodesChange(changes: NodeChange[]): void {
  applyNodeChanges(changes);
}

function handleSelectEdge(edgeId: string): void {
  const edge = findEdge(edgeId);

  if (!edge) return;
  edge.animated = edge.selected;
}

function onEdgesChange(changes: EdgeChange[]): void {
  changes.forEach((c) => {
    switch (c.type) {
      case "select":
        handleSelectEdge(c.id);
        break;
      case "add":
        c.item.type = handleDefaultEdgeType(c.item.type);
        break;
      default:
        break;
    }
  });

  applyEdgeChanges(changes);
}
</script>

<template>
  <ThemeButton />
  <DiagramLeftSideBar />
  <Button
    variant="outline"
    @click="() => erdState.saveErdStateToLocalStorage(getNodes, getEdges)"
    >Save state
  </Button>
  <ClientOnly>
    <VueFlow
      :id="VUEFLOW_ID"
      :class="
        cn('bg-secondary !h-[calc(100%-48px)]', {
          dark: dark,
        })
      "
      :nodes="erdState.getNodes"
      :edges="erdState.getEdges"
      :edges-updatable="true"
      :edge-types="edgeTypes"
      :apply-changes="false"
      :connection-radius="70"
      :auto-connect="true"
      :only-render-visible-elements="false"
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
      <Controls />
    </VueFlow>
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
