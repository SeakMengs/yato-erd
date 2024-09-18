<script setup lang="ts">
import { useVueFlow } from "@vue-flow/core";
import { CirclePlus, FilePenLine } from "lucide-vue-next";
import { VUEFLOW_ID } from "~/constants/key";

const { getNodes } = useVueFlow(VUEFLOW_ID);
const { addTable } = useVueFlowUtils();
</script>

<template>
  <div class="flex flex-col scroll-smooth h-full truncate">
    <div class="flex flex-row justify-between items-center p-2">
      <h3 class="font-semibold ml-2 flex justify-center items-center gap-1">
        <FilePenLine class="w-6 h-6" />
        {{ $t("diagram.leftSideBar.tables") }}
      </h3>
      <Button
        @click="addTable"
        variant="outline"
        class="flex gap-2 items-center"
      >
        <CirclePlus class="w-4 h-4" />
        <p>{{ $t("diagram.leftSideBar.newTable") }}</p>
      </Button>
    </div>
    <Separator class="drop-shadow" />
    <ScrollArea v-if="getNodes.length > 0">
      <div>
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
            'mb-2': getNodes.length === index + 1,
          }"
        />
      </div>
    </ScrollArea>
    <div v-else class="flex items-center justify-center my-6">
      <p>{{ $t("diagram.leftSideBar.noTable") }}</p>
    </div>
  </div>
</template>
