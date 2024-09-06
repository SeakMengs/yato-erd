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
  <div
    :class="
      cn('m-2 p-2 rounded-md hover:bg-secondary truncate', {
        'bg-secondary': isOpen,
      })
    "
  >
    <Collapsible
      :open="isOpen"
      class="flex flex-col gap-4"
      :id="`collapsible-table-${props.tableNodeDataWithNodeId.tableNodeId}`"
    >
      <CollapsibleTrigger as-child @click="toggleOpen">
        <div class="flex flex-row items-center gap-2">
          <ChevronDown class="h-4 w-4" />
          <p>{{ props.tableNodeDataWithNodeId.tableName }}</p>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div class="flex flex-col gap-2 py-2">
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
  </div>
</template>
