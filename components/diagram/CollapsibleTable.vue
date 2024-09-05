<script setup lang="ts">
import { ChevronDown } from "lucide-vue-next";
import type { TableNodeDataWithNodeId } from "~/types/diagram/table_node";

const props = defineProps<{
  // cannot just use type and extend the object, cuz vue will throw unresolve type error
  tableNodeDataWithNodeId: TableNodeDataWithNodeId;
  selected: boolean;
}>();
const isOpen = ref<boolean>(props.selected);
const { addColumn, removeColumn, onCollapsibleClick } = useVueFlowUtils();

function toggleOpen(): void {
  isOpen.value = !isOpen.value;
  onCollapsibleClick(props.tableNodeDataWithNodeId.tableNodeId);
}

watch(
  () => props.selected,
  () => {
    isOpen.value = props.selected;
  },
);
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
        <DiagramEditableTableColumn
          v-for="(column, index) in props.tableNodeDataWithNodeId.columns"
          :table-id="props.tableNodeDataWithNodeId.tableNodeId"
          :column="column"
          :column-position="index"
          :key="index"
          :removeColumn="
            () =>
              removeColumn(
                props.tableNodeDataWithNodeId.tableNodeId,
                column.columnId,
              )
          "
        />
        <Button
          @click="() => addColumn(props.tableNodeDataWithNodeId.tableNodeId)"
          >{{ $t("diagram.leftSideBar.column.add") }}</Button
        >
      </div>
    </CollapsibleContent>
  </Collapsible>
</template>
