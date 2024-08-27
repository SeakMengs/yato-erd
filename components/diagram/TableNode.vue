<script setup lang="ts">
import Card from "~/components/ui/card/Card.vue";
import CardContent from "~/components/ui/card/CardContent.vue";
import CardHeader from "~/components/ui/card/CardHeader.vue";
import CardTitle from "~/components/ui/card/CardTitle.vue";
import type { TableNodeDataWithNodeId } from "~/types/diagram/table_node";
import { Position, Handle } from "@vue-flow/core";

// There are more props being passed by vueflow than the one i define!
const props = defineProps<TableNodeDataWithNodeId>();
</script>

<template>
  <Card class="w-[320px]">
    <CardHeader class="p-4">
      <CardTitle>{{ props.tableName }}</CardTitle>
    </CardHeader>
    <CardContent class="p-0">
      <div v-for="(col, index) in props.columns" :key="index" class="relative">
        <Handle
          :id="`${props.id}-left-${col.columnName}`"
          type="source"
          :position="Position.Left"
          class="absolute top-1/2 transform -translate-y-1/2"
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
          class="absolute top-1/2 transform -translate-y-1/2"
        />
      </div>
    </CardContent>
  </Card>
</template>
