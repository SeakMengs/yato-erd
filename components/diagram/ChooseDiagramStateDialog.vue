<script setup lang="ts">
import { DEFAULT_ERD_STATE } from "~/constants/vueflow";

const isChooseDiagramState = ref<boolean>(true);
const erdState = useErd();

const closeDialog = (): void => {
  isChooseDiagramState.value = false;
};

// Default option if user cancel the dialog
const openExistingDiagram = (): void => {
  erdState.fetchErdState();
  erdState.registerAutoSaveErdState();
  closeDialog();
};

const createNewDiagram = (): void => {
  erdState.state = DEFAULT_ERD_STATE;
  erdState.registerAutoSaveErdState();
  closeDialog();
};
</script>
<template>
  <Dialog v-model:open="isChooseDiagramState">
    <!-- When closing or click outside of the dialog, open the user's existing -->
    <!-- diagram so they don't lose their diagram state -->
    <DialogContent
      class="sm:max-w-[425px]"
      v-on:x-button-click="openExistingDiagram"
      @pointer-down-outside="openExistingDiagram"
    >
      <DialogHeader>
        <DialogTitle>Choose diagram</DialogTitle>
        <DialogDescription>
          Decide whether you want to create a new diagram or use the existing
          diagram that you edited before.
        </DialogDescription>
      </DialogHeader>
      <div class="flex flex-col gap-4">
        <Button variant="outline" @click="openExistingDiagram"
          >Open existing diagram</Button
        >
        <Button variant="outline" @click="createNewDiagram"
          >Create new diagram</Button
        >
      </div>
    </DialogContent>
  </Dialog>
</template>
