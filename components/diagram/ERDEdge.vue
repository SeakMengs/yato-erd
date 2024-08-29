<script setup lang="ts">
import {
  BaseEdge,
  getSmoothStepPath,
  type EdgeProps,
  type SmoothStepEdgeProps,
} from "@vue-flow/core";
import { computed } from "vue";

const props = defineProps<EdgeProps>();
const path = computed(() => getSmoothStepPath(props as SmoothStepEdgeProps));
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<template>
  <g>
    <BaseEdge
      :id="id"
      :style="{ ...style }"
      :path="path[0]"
      :marker-end="markerEnd"
      :label="data?.text"
      :label-x="path[1]"
      :label-y="path[2]"
      :label-style="{ fill: 'white' }"
      :label-show-bg="true"
      :label-bg-style="{ fill: 'red' }"
      :label-bg-padding="[2, 4]"
      :label-bg-border-radius="2"
    />
  </g>
</template>
