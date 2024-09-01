<script setup lang="ts">
import { useVueFlow } from "@vue-flow/core";
import { CirclePlus } from "lucide-vue-next";
import { VUEFLOW_ID } from "~/constants/diagram";

const { getNodes } = useVueFlow(VUEFLOW_ID);
const { addTable } = useVueFlowUtils();
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
          :table-node-data-with-node-id="{
            tableNodeId: node.id,
            columns: node.data?.columns ?? [],
            tableName: node.data?.tableName ?? '',
          }"
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
