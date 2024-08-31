<script setup lang="ts">
import {
  VueFlow,
  useVueFlow,
  type NodeChange,
  type Edge,
  type GraphEdge,
  type Connection,
  MarkerType,
  type EdgeTypesObject,
  type EdgeChange,
} from "@vue-flow/core";
import { ref } from "vue";
import { MiniMap } from "@vue-flow/minimap";
import { Controls } from "@vue-flow/controls";
import type { TableNode } from "~/types/diagram/table_node";
import ThemeButton from "~/components/ThemeButton.vue";
import { NodeType } from "~/types/diagram/node";
import { EdgeType } from "~/types/diagram/edge";
import ERDEdge from "~/components/diagram/ERDEdge.vue";
import { THEME } from "~/types/theme";
import { VUEFLOW_ID } from "~/constants/diagram";

const { applyNodeChanges, applyEdgeChanges, addEdges, updateEdge, findEdge } =
  useVueFlow(VUEFLOW_ID);

const colorMode = useColorMode();
const dark = computed(() => colorMode.preference === THEME.DARK);

const edgeTypes = {
  default: markRaw(ERDEdge),
  erd: markRaw(ERDEdge),
} satisfies EdgeTypesObject;

const nodes = ref<TableNode[]>([
  {
    id: "1",
    position: { x: 100, y: 100 },
    data: {
      tableName: "Node 1",
      columns: [
        {
          columnName: "Lol",
          attribute: {},
        },
      ],
    },
    type: NodeType.Table,
  },
  {
    id: "2",
    position: { x: 250, y: 250 },
    data: {
      tableName: "Node 2",
      columns: [
        {
          columnName: "Lolc1",
          attribute: {},
        },
        {
          columnName: "Lolc2",
          attribute: {},
        },
      ],
    },
    type: NodeType.Table,
  },
]);

const edges = ref<Edge[]>([
  {
    id: "e1->2",
    source: "1",
    type: EdgeType.ERD,
    target: "2",
  },
]);

// basically for user to move the connected edge to other handle
function onEdgeUpdate({
  edge,
  connection,
}: {
  edge: GraphEdge;
  connection: Connection;
}): void {
  if (!isValidEdgeConnection(connection)) return;

  updateEdge(edge, connection);
}

function onConnect(params: Edge | Connection): void {
  addEdges({ ...params, markerEnd: MarkerType.Arrow, type: "smoothstep" });
}

function onNodesChange(changes: NodeChange[]): void {
  applyNodeChanges(changes);
}

function handleSelectEdge(edgeId: string): void {
  const edge = findEdge(edgeId);

  if (!edge) return;
  edge.animated = edge.selected;
}

function handleAddEdgeType(type: EdgeType | string): string {
  return type === EdgeType.Default ? EdgeType.ERD : type;
}

function onEdgesChange(changes: EdgeChange[]): void {
  changes.forEach((c) => {
    switch (c.type) {
      case "select":
        handleSelectEdge(c.id);
        break;
      case "add":
        c.item.type = handleAddEdgeType(c.item.type);
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
  <ClientOnly>
    <VueFlow
      :id="VUEFLOW_ID"
      :class="
        cn('bg-secondary !h-[calc(100%-48px)]', {
          dark: dark,
        })
      "
      :nodes="nodes"
      :edges-updatable="true"
      :edges="edges"
      :edge-types="edgeTypes"
      :apply-changes="false"
      :connection-radius="70"
      :auto-connect="true"
      :only-render-visible-elements="true"
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
            tableName: erdNodeprops.data.tableName,
            columns: erdNodeprops.data.columns,
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
