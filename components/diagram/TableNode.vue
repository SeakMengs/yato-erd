<script setup lang="ts">
import type { TableNodeDataWithNodeId } from "~/types/diagram/table_node";
import { Position, Handle, type Connection, useVueFlow } from "@vue-flow/core";
import { VUEFLOW_ID } from "~/constants/diagram";

// There are more props being passed by vueflow than the type i define!
const props = defineProps<TableNodeDataWithNodeId>();
const { findNode } = useVueFlow(VUEFLOW_ID);

const selected = computed<boolean>(() => {
  return findNode(props.id)?.selected ?? false;
});

function isValidConnection(connection: Connection): boolean {
  // Prevent handle to connect with it own node (table basically)
  return connection.source !== connection.target;
}
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
      <CardTitle>{{ props.tableName }}</CardTitle>
    </CardHeader>
    <CardContent class="p-0">
      <div v-for="(col, index) in props.columns" :key="index" class="relative">
        <Handle
          :id="`${props.id}-left-${col.columnName}`"
          type="source"
          :position="Position.Left"
          :is-valid-connection="isValidConnection"
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
          :id="`${props.id}-right-${col.columnName}`"
          type="source"
          :position="Position.Right"
          class="absolute top-1/2 transform -translate-y-1/2 !bg-primary"
        />
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>
.vue-flow__handle {
  height: 1.5rem;
  width: 0.5rem;
  border-color: hsl(var(--primary));
  border-radius: 0.25rem;
}
</style>
