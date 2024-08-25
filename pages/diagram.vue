<script setup lang="ts">
import {
  VueFlow,
  useVueFlow,
  type NodeChange,
  type Edge,
  type GraphEdge,
  type Connection,
} from "@vue-flow/core";
import { ref } from "vue";
import { MiniMap } from "@vue-flow/minimap";
import { Controls } from "@vue-flow/controls";
import TableNode from "~/components/diagram/node/TableNode.vue";
import type { CustomTableNode } from "~/types/diagram/node/table_node";
import ThemeButton from "~/components/ThemeButton.vue";

const { applyNodeChanges, addEdges, updateEdge } = useVueFlow();

const nodes = ref<CustomTableNode[]>([
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: {
      tableName: "Node 1",
      columns: [
        {
          columnName: "Lol",
          attribute: {},
        },
      ],
    },
    type: "table",
  },
  {
    id: "2",
    position: { x: 100, y: 100 },
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
    type: "table",
  },
]);

const edges = ref<Edge[]>([
  // {
  //   id: "e1->2",
  //   source: "1",
  //   type: "step",
  //   target: "2",
  // },
]);

function onEdgeUpdate({
  edge,
  connection,
}: {
  edge: GraphEdge;
  connection: Connection;
}): void {
  updateEdge(edge, connection);
}

function onConnect(params: Edge | Connection): void {
  addEdges([params]);
}

async function onNodesChange(changes: NodeChange[]): Promise<void> {
  console.log(changes);

  const nextChanges = [];

  for (const change of changes) {
    nextChanges.push(change);
  }

  applyNodeChanges(nextChanges);
}
</script>

<template>
  <ThemeButton />
  <ClientOnly>
    <VueFlow
      class="bg-zinc-700"
      :nodes="nodes"
      :edges="edges"
      :apply-changes="false"
      @edge-update="onEdgeUpdate"
      @connect="onConnect"
      @nodes-change="onNodesChange"
    >
      <template #node-table="props">
        <TableNode
          v-bind="{
            ...props,
            tableName: props.data.tableName,
            columns: props.data.columns,
          }"
        />
      </template>
      <!-- <MiniMap pannable zoomable /> -->
      <Controls />
    </VueFlow>
  </ClientOnly>
</template>

<style lang="css">
@import "@vue-flow/core/dist/style.css";

/* this contains the default theme, these are optional styles */
@import "@vue-flow/core/dist/theme-default.css";

/* Comment this out if doesn't use */
@import "@vue-flow/minimap/dist/style.css";
@import "@vue-flow/controls/dist/style.css";
</style>
