<script setup lang="ts">
import Card from "~/components/ui/card/Card.vue";
import CardContent from "~/components/ui/card/CardContent.vue";
import CardHeader from "~/components/ui/card/CardHeader.vue";
import CardTitle from "~/components/ui/card/CardTitle.vue";
import type { TableNodeData } from "~/types/diagram/node/table_node";
import { Position, Handle } from "@vue-flow/core";

defineProps<TableNodeData>();
</script>

<template>
  <Card class="w-[320px]">
    <CardHeader class="p-4">
      <CardTitle>{{ tableName }}</CardTitle>
    </CardHeader>
    <CardContent class="p-0">
      <div v-for="(col, index) in columns" :key="index" class="relative">
        <Handle
          type="source"
          :position="Position.Left"
          class="absolute top-1/2 transform -translate-y-1/2"
        />
        <!-- Column content -->
        <div>
          <Separator class="" />
          <div class="p-4">
            <p>{{ col.columnName }}</p>
          </div>
        </div>
        <!-- End of column content -->
        <Handle
          type="source"
          :position="Position.Right"
          class="absolute top-1/2 transform -translate-y-1/2"
        />
      </div>
    </CardContent>
  </Card>
</template>
