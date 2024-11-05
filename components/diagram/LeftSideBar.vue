<script setup lang="ts">
import { useVueFlow } from "@vue-flow/core";
import { VueDraggableNext as draggable } from "vue-draggable-next";
import { CirclePlus, FilePenLine } from "lucide-vue-next";
import { VUEFLOW_ID } from "~/constants/key";

const { nodes } = useVueFlow(VUEFLOW_ID);
const { addTable, smoothFitView } = useVueFlowUtils();

const editTableNameId = ref<string | undefined>();
const { interactive } = useInteractive();

function closeEditTableName(): void {
  editTableNameId.value = undefined;
}

function openEditTableName(nodeId: string): void {
  smoothFitView([nodeId]);
  editTableNameId.value = nodeId;
}
</script>

<template>
  <div class="flex flex-col scroll-smooth h-full truncate">
    <div class="flex flex-row justify-between items-center p-2">
      <h3 class="font-semibold ml-2 flex justify-center items-center gap-1">
        <FilePenLine class="w-6 h-6" />
        {{ $t("diagram.leftSideBar.tables") }}
      </h3>
      <Button
        :disabled="!interactive"
        @click="addTable"
        variant="outline"
        class="flex gap-2 items-center"
      >
        <CirclePlus class="w-4 h-4" />
        <p>{{ $t("diagram.leftSideBar.newTable") }}</p>
      </Button>
    </div>
    <Separator class="drop-shadow" />
    <ScrollArea v-if="nodes.length > 0">
      <draggable :list="nodes" :disabled="!interactive" handle=".handle">
        <DiagramCollapsibleTable
          v-for="(node, index) in nodes"
          :key="node.id"
          :table-node-data-with-node-id="{
            tableNodeId: node.id,
            columns: node.data?.columns ?? [],
            tableName: node.data?.tableName ?? '',
          }"
          :edit-table-name="editTableNameId === node.id"
          :selected="node.selected ?? false"
          @close-edit-table-name="closeEditTableName"
          @open-edit-table-name="openEditTableName"
          :class="{
            'mb-2': nodes.length === index + 1,
          }"
        />
      </draggable>
    </ScrollArea>
    <div v-else class="flex items-center justify-center my-6">
      <p>{{ $t("diagram.leftSideBar.noTable") }}</p>
    </div>
  </div>
</template>
