<script setup lang="ts">
import { useVueFlow } from "@vue-flow/core";
import { ChevronDown } from "lucide-vue-next";
import { DEFAULT_COLUMN } from "~/constants/table";
import type {
  TableNodeData,
  TableNodeDataWithNodeId,
} from "~/types/diagram/table_node";

const props = defineProps<
  TableNodeDataWithNodeId & {
    selected: boolean;
  }
>();
const isOpen = ref<boolean>(props.selected);
const { updateNodeData } = useVueFlow();

function toggleOpen(): void {
  isOpen.value = !isOpen.value;
}

function addColumn(): void {
  props.columns.push({
    ...structuredClone(DEFAULT_COLUMN),
    columnName: `column_${props.columns.length + 1}`,
  });
}

// Index position of the column array that we want to delete
function removeColumn(pos: number): void {
  if (pos < 0 && pos >= props.columns.length) {
    return;
  }

  const newColumns = props.columns.filter((_, i) => i != pos);
  const newData = {
    tableName: props.tableName,
    columns: newColumns,
  } satisfies TableNodeData;
  updateNodeData(props.id, newData);
}
</script>

<template>
  <Collapsible
    :open="isOpen"
    class="py-4 flex flex-col gap-4"
    :id="`collapsible-table-${props.id}`"
  >
    <CollapsibleTrigger as-child @click="toggleOpen">
      <div class="flex flex-row items-center gap-4">
        <ChevronDown class="h-4 w-4" />
        <p>{{ props.tableName }}</p>
      </div>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div class="flex flex-col gap-4">
        <DiagramModifyTableColumnContent
          v-for="(column, index) in props.columns"
          :table-id="props.id"
          :column="column"
          :column-position="index"
          :key="index"
          :removeColumn="() => removeColumn(index)"
        />
        <Button @click="addColumn">Add column</Button>
      </div>
    </CollapsibleContent>
  </Collapsible>
</template>
