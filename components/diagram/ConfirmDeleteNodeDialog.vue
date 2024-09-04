<script setup lang="ts">
import { useVueFlow } from "@vue-flow/core";
import { VUEFLOW_ID } from "~/constants/key";
import { Trash } from "lucide-vue-next";
import type { CustomTableNode } from "~/types/diagram/table_node";

export type ConfirmDeleteNodeDialogProps = {
  open: boolean;
  nodeId: string | null | undefined;
  onOpenChange: (open: boolean) => void;
};

const props = defineProps<ConfirmDeleteNodeDialogProps>();
const { deleteTableByNodeId } = useVueFlowUtils();
const { findNode } = useVueFlow(VUEFLOW_ID);
const node = ref<CustomTableNode | undefined>();

function assignNode(): void {
  const tempNode = findNode(props.nodeId);

  if (tempNode) {
    node.value = tempNode as CustomTableNode;
  }
}

onMounted(() => {
  assignNode();
});

watch(
  () => props.nodeId,
  () => {
    assignNode();
  },
);
</script>

<template>
  <AlertDialog v-if="nodeId && node" :open="props.open">
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
        <AlertDialogCancel @click="onOpenChange(false)">{{
          $t("diagram.cancel")
        }}</AlertDialogCancel>
        <AlertDialogAction
          @click="
            () => {
              if (!node) {
                return;
              }

              deleteTableByNodeId(node.id);
              onOpenChange(false);
            }
          "
          >{{ $t("diagram.confirm") }}</AlertDialogAction
        >
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
