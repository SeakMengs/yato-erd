<script setup lang="ts">
const erdState = useErd();
const { registerAutoSaveErdState } = useVueFlowUtils();

onMounted(() => {
  erdState.fetchErdState();
  registerAutoSaveErdState();
});

// const collaborate = useCollaborate();
// onMounted(() => collaborate.connect());
</script>

<template>
  <DiagramConfirmDeleteNodeDialog />
  <ResizablePanelGroup id="handle-group-1" direction="horizontal" class="">
    <ResizablePanel id="handle-panel-1" :default-size="20">
      <DiagramLeftSideBar />
    </ResizablePanel>
    <ResizableHandle id="handle-handle-1" with-handle />
    <ResizablePanel id="handle-panel-2" :default-size="80" :min-size="1">
      <DiagramFlow />
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
