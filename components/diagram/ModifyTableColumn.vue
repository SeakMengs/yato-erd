<script setup lang="ts">
import { Trash } from "lucide-vue-next";
import { DEFAULT_COLUMN } from "~/constants/table";
import type { TableNodeDataColumn } from "~/types/diagram/table_node";

const props = defineProps<{
  tableId: string;
  columnPosition: number;
  column: TableNodeDataColumn;
  removeColumn: () => void;
}>();

watchEffect(() => {
  if (!props.column.columnName) {
    props.column.columnName = `column_${props.columnPosition + 1}`;
  }

  if (!props.column.attribute.type) {
    props.column.attribute.type = structuredClone(
      DEFAULT_COLUMN.attribute.type,
    );
  }
});
</script>

<template>
  <div class="flex flex-row items-center gap-4">
    <Input v-model="props.column.columnName" />
    <Input v-model="props.column.attribute.type" />
    <Button
      @click="removeColumn"
      variant="outline"
      size="icon"
      class="flex-shrink-0 hover:border-red-900 hover:text-red-900"
    >
      <Trash class="w-4 h-4" />
    </Button>
  </div>
</template>
