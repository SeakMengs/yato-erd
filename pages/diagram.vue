<script setup lang="ts">
import { Controls } from "@vue-flow/controls";
import {
  VueFlow,
  useVueFlow,
  type Connection,
  type Edge,
  type EdgeChange,
  type EdgeTypesObject,
  type GraphEdge,
  type NodeChange,
} from "@vue-flow/core";
import { defaults } from "autoprefixer";
import ThemeButton from "~/components/ThemeButton.vue";
import type { ConfirmDeleteNodeDialogProps } from "~/components/diagram/ConfirmDeleteNodeDialog.vue";
import ERDEdge from "~/components/diagram/ERDEdge.vue";
import { VUEFLOW_ID } from "~/constants/key";
import { THEME } from "~/types/theme";

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

const isDeleteNodeDialogOpen = ref<
  Omit<ConfirmDeleteNodeDialogProps, "onOpenChange">
>({
  open: false,
  nodeId: undefined,
});

function onRemoveNodeChange(nodeId: string): void {
  isDeleteNodeDialogOpen.value = {
    nodeId: nodeId,
    open: true,
  };
}

function onIsDeleteNodeDialogOpenChange(open: boolean): void {
  isDeleteNodeDialogOpen.value = {
    nodeId: open ? isDeleteNodeDialogOpen.value.nodeId : undefined,
    open: open,
  };
}

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
  const nextChanges: NodeChange[] = [];

  changes.forEach((c) => {
    switch (c.type) {
      case "remove":
        // Ask user for confirmation before deleting the table node
        onRemoveNodeChange(c.id);
        break;
      default:
        nextChanges.push(c);
    }
  });

  applyNodeChanges(nextChanges);
}

function handleSelectEdge(edgeId: string): void {
  const edge = findEdge(edgeId);

  if (!edge) return;
  edge.animated = edge.selected;
}

function onEdgesChange(changes: EdgeChange[]): void {
  const nextChanges: EdgeChange[] = [];

  changes.forEach((c) => {
    switch (c.type) {
      case "select":
        handleSelectEdge(c.id);
        nextChanges.push(c);
        break;
      case "add":
        c.item.type = handleDefaultEdgeType(c.item.type);
        nextChanges.push(c);
        break;
      case "remove":
      // FIXME: check for remove table also remove edge. basically remove edge not handled yet
      default:
        nextChanges.push(c);
    }
  });

  applyEdgeChanges(nextChanges);
}
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
