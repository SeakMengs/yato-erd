<script setup lang="ts">
const erdState = useErd();
const {} = useCollaborate({});
</script>

<template>
  <ThemeButton />
  <Button variant="outline" @click="erdState.saveErdStateToLocalStorage"
    >Save state
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
    <ResizablePanel id="handle-panel-2" :default-size="80">
      <DiagramFlow />
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
