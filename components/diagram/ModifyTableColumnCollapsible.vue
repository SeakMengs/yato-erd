<script setup lang="ts">
import { useVueFlow } from "@vue-flow/core";
import { ChevronDown } from "lucide-vue-next";
import { VUEFLOW_ID } from "~/constants/diagram";
import { DEFAULT_COLUMN } from "~/constants/table";
import type {
  TableNodeData,
  TableNodeDataWithNodeId,
} from "~/types/diagram/table_node";

const props = defineProps<{
  // cannot just use type and extend the object, cuz vue will throw unresolve type error
  tableNodeDataWithNodeId: TableNodeDataWithNodeId;
  selected: boolean;
}>();
const isOpen = ref<boolean>(props.selected);
const { updateNodeData } = useVueFlow(VUEFLOW_ID);

function toggleOpen(): void {
  isOpen.value = !isOpen.value;
}

function addColumn(): void {
  props.tableNodeDataWithNodeId.columns.push({
    ...structuredClone(DEFAULT_COLUMN),
    columnId: generateShortId(),
    columnName: `column_${props.tableNodeDataWithNodeId.columns.length + 1}`,
  });
}

// Index position of the column array that we want to delete
function removeColumn(pos: number): void {
  if (pos < 0 && pos >= props.tableNodeDataWithNodeId.columns.length) {
    return;
  }

  const newColumns = props.tableNodeDataWithNodeId.columns.filter(
    (_, i) => i != pos,
  );
  const newData = {
    tableName: props.tableNodeDataWithNodeId.tableName,
    columns: newColumns,
  } satisfies TableNodeData;
  updateNodeData(props.tableNodeDataWithNodeId.tableNodeId, newData);
}
</script>

<template>
  <Collapsible
    :open="isOpen"
    class="py-4 flex flex-col gap-4"
    :id="`collapsible-table-${props.tableNodeDataWithNodeId.tableNodeId}`"
  >
    <CollapsibleTrigger as-child @click="toggleOpen">
      <div class="flex flex-row items-center gap-4">
        <ChevronDown class="h-4 w-4" />
        <p>{{ props.tableNodeDataWithNodeId.tableName }}</p>
      </div>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div class="flex flex-col gap-4">
        <DiagramModifyTableColumnContent
          v-for="(column, index) in props.tableNodeDataWithNodeId.columns"
          :table-id="props.tableNodeDataWithNodeId.tableNodeId"
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
