<script setup lang="ts">
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { ChevronDown, CirclePlus, PencilLine, Trash } from "lucide-vue-next";
import type { TableNodeDataWithNodeId } from "~/types/diagram/table_node";

const props = defineProps<{
  tableNodeDataWithNodeId: TableNodeDataWithNodeId;
  selected: boolean;
  editTableName: boolean;
}>();

const emit = defineEmits<{
  (e: "closeEditTableName"): void;
  (e: "openEditTableName", nodeId: string): void;
}>();

const { interactive } = useInterative();
const isOpen = ref<boolean>(props.selected);
const {
  removeTable,
  addColumn,
  removeColumn,
  onCollapsibleClick,
  unSelectNodes,
} = useVueFlowUtils();

function toggleOpen(): void {
  isOpen.value = !isOpen.value;
  onCollapsibleClick(props.tableNodeDataWithNodeId.tableNodeId);
}

function closeEditTableName(): void {
  emit("closeEditTableName");
}

function openEditTableName(): void {
  emit("openEditTableName", props.tableNodeDataWithNodeId.tableNodeId);
}

function onEditTable(): void {
  unSelectNodes();
  openEditTableName();
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
      class="flex flex-col gap-2"
      :id="`collapsible-table-${props.tableNodeDataWithNodeId.tableNodeId}`"
    >
      <CollapsibleTrigger as-child @click="toggleOpen">
        <div
          v-if="!editTableName"
          class="flex flex-row items-center justify-between gap-2"
        >
          <div class="w-full flex flex-row items-center gap-2">
            <span class="border-2 h-6 dark:border-white"></span>
            <ChevronDown
              :data-state="isOpen ? 'open' : 'close'"
              class="h-4 w-4 data-[state=close]:-rotate-90 transition-transform duration-200"
            />
            <p v-if="!editTableName">
              {{ props.tableNodeDataWithNodeId.tableName }}
            </p>
          </div>
          <div @click.stop>
            <fieldset class="flex gap-2 mr-[6px]" :disabled="!interactive">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button
                      class="hover:border-blue-900 hover:text-blue-900"
                      size="xs"
                      @click="onEditTable"
                    >
                      <PencilLine class="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit table name</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button
                      size="xs"
                      class="hover:border-red-900 hover:text-red-900"
                      @click="
                        removeTable(props.tableNodeDataWithNodeId.tableNodeId)
                      "
                    >
                      <Trash class="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete table</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </fieldset>
          </div>
        </div>
        <DiagramCollapsibleTableEditName
          v-else
          :key="props.tableNodeDataWithNodeId.tableNodeId"
          :is-open="isOpen"
          :table-node-data-with-node-id="props.tableNodeDataWithNodeId"
          @close-edit-table-name="closeEditTableName"
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div v-auto-animate class="flex flex-col gap-2 py-2">
          <DiagramEditableTableColumn
            v-for="(column, index) in props.tableNodeDataWithNodeId.columns"
            :table-id="props.tableNodeDataWithNodeId.tableNodeId"
            :column="column"
            :column-position="index"
            :key="column.columnId"
            @removeColumn="
              () =>
                removeColumn(
                  props.tableNodeDataWithNodeId.tableNodeId,
                  column.columnId,
                )
            "
          />
          <Button
            class="flex-shrink-0 text-center gap-2"
            :disabled="!interactive"
            @click="() => addColumn(props.tableNodeDataWithNodeId.tableNodeId)"
          >
            <CirclePlus class="w-4 h-4" />
            {{ $t("diagram.leftSideBar.column.add") }}</Button
          >
        </div>
      </CollapsibleContent>
    </Collapsible>
  </div>
</template>
