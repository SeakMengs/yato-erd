<script setup lang="ts">
import {
  VueFlow,
  useVueFlow,
  type NodeChange,
  type Node,
  type Edge,
} from "@vue-flow/core";
import { ref } from "vue";
import { MiniMap } from "@vue-flow/minimap";
import { Controls } from "@vue-flow/controls";
const { applyNodeChanges } = useVueFlow();

const nodes = ref<Node[]>([
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "Node 1" },
    style: {
      backgroundColor: "rgba(16, 185, 129, 0.5)",
      width: "200px",
      height: "200px",
    },
  },
  {
    id: "2",
    position: { x: 100, y: 100 },
    data: { label: "Node 2" },
    style: {
      backgroundColor: "rgba(16, 185, 129, 0.5)",
      width: "200px",
      height: "200px",
    },
  },
]);

const edges = ref<Edge[]>([
  {
    id: "e1->2",
    source: "1",
    type: "step",
    target: "2",
  },
]);

const onNodesChange = async (changes: NodeChange[]) => {
  console.log(changes);

  const nextChanges = [];

  for (const change of changes) {
    nextChanges.push(change);
  }

  applyNodeChanges(nextChanges);
};
</script>

<template>
  <ClientOnly>
    <VueFlow
      class="bg-blue-500"
      :nodes="nodes"
      :edges="edges"
      :apply-changes="false"
      @nodes-change="onNodesChange"
    >
      <MiniMap pannable zoomable />
      <Controls />
    </VueFlow>
  </ClientOnly>
</template>

<style lang="css">
/* these are necessary styles for vue flow */
@import "@vue-flow/core/dist/style.css";

/* this contains the default theme, these are optional styles */
@import "@vue-flow/core/dist/theme-default.css";

/* Comment this out if doesn't use */
@import "@vue-flow/minimap/dist/style.css";
@import "@vue-flow/controls/dist/style.css";
</style>
