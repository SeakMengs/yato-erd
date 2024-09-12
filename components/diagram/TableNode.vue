<script setup lang="ts">
import type { TableNodeDataWithNodeId } from "~/types/diagram/table_node";
import { Position, Handle, useVueFlow, type Connection } from "@vue-flow/core";
import { VUEFLOW_ID } from "~/constants/key";

// There are more props being passed by vueflow than the type i define!
const props = defineProps<{
  // cannot just use type and extend the object, cuz vue will throw unresolve type error
  tableNodeDataWithNodeId: TableNodeDataWithNodeId;
}>();
const { findNode } = useVueFlow(VUEFLOW_ID);
const { isValidEdgeConnection } = useVueFlowUtils();

const selected = computed<boolean>(() => {
  return findNode(props.tableNodeDataWithNodeId.tableNodeId)?.selected ?? false;
});
</script>

<template>
  <Card
    :class="
      cn('w-[320px]', {
        'ring-2 ring-ring': selected,
        // maybe one day allow user to export with or without drop shadow
        'drop-shadow': true,
      })
    "
  >
    <CardHeader class="p-4">
      <CardTitle>{{ props.tableNodeDataWithNodeId.tableName }}</CardTitle>
    </CardHeader>
    <CardContent class="p-0">
      <div
        v-for="(col, index) in props.tableNodeDataWithNodeId.columns"
        :key="index"
        class="relative hover:bg-secondary"
      >
        <Handle
          :id="
            getHandleId(
              'left',
              props.tableNodeDataWithNodeId.tableNodeId,
              col.columnId,
            )
          "
          type="source"
          :position="Position.Left"
          :is-valid-connection="
            (connection) => isValidEdgeConnection(connection, true)
          "
          class="absolute top-1/2 transform -translate-y-1/2 !bg-primary"
        />
        <!-- Column content -->
        <div>
          <Separator class="" />
          <div class="p-4 flex justify-between items-center">
            <p>{{ col.columnName }}</p>
            <p>{{ col.attribute.type }}</p>
          </div>
        </div>
        <!-- End of column content -->
        <Handle
          :id="
            getHandleId(
              'right',
              props.tableNodeDataWithNodeId.tableNodeId,
              col.columnId,
            )
          "
          type="source"
          :position="Position.Right"
          class="absolute top-1/2 transform -translate-y-1/2 !bg-primary"
          :is-valid-connection="
            (connection) => isValidEdgeConnection(connection, true)
          "
        />
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>
.vue-flow__handle {
  height: 1rem;
  width: 0.25rem;
  border-color: hsl(var(--primary));
  border-radius: 0.25rem;
}
</style>
