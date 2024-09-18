<script setup lang="ts">
const erdState = useErd();
onMounted(() => erdState.fetchErdState());

const { exportAsImage } = useExport();
// const collaborate = useCollaborate();
// onMounted(() => collaborate.connect());
</script>

<template>
  <ThemeButton />
  <Button variant="outline" @click="erdState.saveErdStateToLocalStorage"
    >Save state
  </Button>
  <Button
    variant="outline"
    @click="exportAsImage({ type: 'png', shouldDownload: true })"
    >Export as png
  </Button>
  <DiagramConfirmDeleteNodeDialog />
  <ResizablePanelGroup
    id="handle-group-1"
    direction="horizontal"
    class="!h-[calc(100%-48px)] rounded-lg border"
  >
    <ResizablePanel id="handle-panel-1" :default-size="20">
      <DiagramLeftSideBar />
    </ResizablePanel>
    <ResizableHandle id="handle-handle-1" with-handle />
    <ResizablePanel id="handle-panel-2" :default-size="80" :min-size="1">
      <DiagramFlow />
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
