<script setup lang="ts">
import { useVueFlow } from "@vue-flow/core";
import { CirclePlus } from "lucide-vue-next";
import { VUEFLOW_ID } from "~/constants/key";

const { getNodes } = useVueFlow(VUEFLOW_ID);
const { addTable } = useVueFlowUtils();
</script>

<template>
  <div class="flex flex-col scroll-smooth h-full truncate">
    <div class="flex flex-row justify-between items-center p-4">
      <h1>{{ $t("diagram.leftSideBar.editTables") }}</h1>
      <Button
        @click="addTable"
        variant="outline"
        class="flex gap-2 items-center"
      >
        <CirclePlus class="w-4 h-4" />
        <p>{{ $t("diagram.leftSideBar.newTable") }}</p>
      </Button>
    </div>
    <ScrollArea
      class="max-h-[calc(100%-72px)] p-4 py-0"
      v-if="getNodes.length > 0"
    >
      <DiagramCollapsibleTable
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
      <p>{{ $t("diagram.leftSideBar.noTable") }}</p>
    </div>
  </div>
</template>
