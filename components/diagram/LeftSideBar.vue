<script setup lang="ts">
import { useVueFlow } from "@vue-flow/core";
import { CirclePlus } from "lucide-vue-next";
import { VUEFLOW_ID } from "~/constants/diagram";
import { DEFAULT_TABLE } from "~/constants/table";
import { NodeType } from "~/types/diagram/node";

const { getNodes, addNodes } = useVueFlow(VUEFLOW_ID);

function addTable(): void {
  const newTable = structuredClone(DEFAULT_TABLE);

  newTable.id = crypto.randomUUID();
  newTable.data.tableName = `Table-${getNodes.value.length + 1}`;

  const conflict = getNodes.value.some((node) => {
    if (node.type !== NodeType.Table) {
      return false;
    }

    return (
      node.data?.tableName === newTable.data.tableName ||
      node.id === newTable.id
    );
  });

  if (conflict) {
    return addTable();
  }

  newTable.position = generateRandomNodePosition();
  addNodes(newTable);
}
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button variant="outline"> Open Sheet </Button>
    </SheetTrigger>
    <SheetContent side="left" class="p-0 scroll-smooth">
      <SheetHeader class="mt-4 p-6 pb-0">
        <div class="flex flex-row justify-between items-center">
          <SheetTitle>Edit tables</SheetTitle>
          <Button
            @click="addTable"
            variant="outline"
            class="flex gap-2 items-center"
          >
            <CirclePlus class="w-4 h-4" />
            <p>New table</p>
          </Button>
        </div>
        <SheetDescription></SheetDescription>
      </SheetHeader>
      <ScrollArea
        class="h-[calc(100%-72px)] p-6 py-0"
        v-if="getNodes.length > 0"
      >
        <DiagramModifyTableColumnCollapsible
          v-for="(node, index) in getNodes"
          :key="node.id"
          :id="node.id"
          :table-name="node.data?.tableName ?? ''"
          :columns="node.data?.columns ?? []"
          :selected="node.selected ?? false"
          :class="{
            'mb-6': getNodes.length === index + 1,
          }"
        />
      </ScrollArea>
      <div v-else class="flex items-center justify-center my-6">
        <p>No table</p>
      </div>
    </SheetContent>
  </Sheet>
</template>
