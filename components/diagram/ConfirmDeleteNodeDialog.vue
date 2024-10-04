<script setup lang="ts">
import { useVueFlow } from "@vue-flow/core";
import { VUEFLOW_ID } from "~/constants/key";
import { Trash } from "lucide-vue-next";
import type { CustomTableNode } from "~/types/diagram/table_node";

const { nodeId, onCancel, onConfirm } = useRemoveNodeDiloag();
const { findNode } = useVueFlow(VUEFLOW_ID);
const node = computed<CustomTableNode | undefined>(() => {
  const tempNode = findNode(nodeId.value);

  if (!tempNode) {
    onCancel();
    return undefined;
  }

  return tempNode as CustomTableNode;
});
</script>

<template>
  <AlertDialog v-if="nodeId && node" :open="!!node">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle class="flex flex-row items-center gap-2 text-red-700">
          <Trash class="w-4 h-4" />
          Delete table?</AlertDialogTitle
        >
        <AlertDialogDescription class="inline">
          Are you sure you want to delete table
          <strong>{{ " " + node.data?.tableName }}</strong>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="onCancel">
          {{ $t("diagram.cancel") }}
        </AlertDialogCancel>
        <AlertDialogAction @click="onConfirm"> Delete </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
