<script setup lang="ts">
import { useVueFlow } from "@vue-flow/core";
import { VUEFLOW_ID } from "~/constants/key";

// const collaborate = useCollaborate();
// onMounted(() => collaborate.connect());
const { getNodes, getEdges, setNodes } = useVueFlow(VUEFLOW_ID);
const { layout } = useLayout();
</script>

<template>
  <!-- <Button @click="setNodes(layout(getNodes, getEdges, 'LR'))">LR</Button> -->
  <!-- <Button @click="setNodes(layout(getNodes, getEdges, 'RL'))">RL</Button> -->
  <!-- <Button @click="setNodes(layout(getNodes, getEdges, 'TB'))">TB</Button> -->
  <!-- <Button @click="setNodes(layout(getNodes, getEdges, 'BT'))">BT</Button> -->

  <DiagramChooseDiagramStateDialog />
  <DiagramConfirmDeleteNodeDialog />
  <ResizablePanelGroup id="handle-group-1" direction="horizontal">
    <ResizablePanel id="handle-panel-1" :default-size="20">
      <DiagramLeftSideBar />
    </ResizablePanel>
    <ResizableHandle id="handle-handle-1" with-handle />
    <ResizablePanel id="handle-panel-2" :default-size="80" :min-size="1">
      <DiagramFlow />
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
