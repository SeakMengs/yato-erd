<script setup lang="ts">
import type { CustomTableNodeProps } from "~/types/diagram/table_node";
import { Position, Handle } from "@vue-flow/core";
import { KeyRound, LifeBuoy } from "lucide-vue-next";

const props = defineProps<CustomTableNodeProps>();
const { isValidEdgeConnection } = useVueFlowUtils();

const iconSize = "w-4 h-4";
</script>

<template>
  <Card
    :class="
      cn('min-w-[320px]', {
        'ring-1 ring-ring': props.selected,
        // maybe one day allow user to export with or without drop shadow
        'drop-shadow': true,
      })
    "
  >
    <CardHeader class="p-4 rounded-t-lg">
      <CardTitle>{{ props.data.tableName }}</CardTitle>
    </CardHeader>
    <CardContent class="p-0">
      <div
        v-for="(col, index) in props.data.columns"
        :key="col.columnId"
        class="relative hover:bg-secondary"
        :class="
          cn({
            'rounded-b-lg': index === props.data.columns.length - 1,
          })
        "
      >
        <Handle
          :id="getHandleId('left', props.id, col.columnId)"
          type="source"
          :position="Position.Left"
          :is-valid-connection="
            (connection) => isValidEdgeConnection(connection, true)
          "
          :class="
            cn({
              'opacity-0': !props.selected,
            })
          "
          class="absolute top-1/2 transform -translate-y-1/2 !bg-primary"
        />
        <!-- Column content -->

        <div>
          <Separator class="" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <div class="p-2 flex justify-between items-center gap-2">
                  <p class="flex justify-center items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <KeyRound
                            :class="iconSize"
                            v-if="col.attribute.indexType === 'Primary key'"
                          />
                          <LifeBuoy
                            :class="iconSize"
                            v-else-if="col.attribute.indexType === 'Unique'"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{{ col.attribute.indexType }}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {{ col.columnName }}
                  </p>
                  <p>
                    {{
                      `${col.attribute.type}${col.attribute.nullable ? "?" : ""}`
                    }}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent v-if="col.userComment">
                <p>Comment: {{ col.userComment }}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <!-- End of column content -->
        <Handle
          :id="getHandleId('right', props.id, col.columnId)"
          type="source"
          :position="Position.Right"
          :class="
            cn({
              'opacity-0': !props.selected,
            })
          "
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
