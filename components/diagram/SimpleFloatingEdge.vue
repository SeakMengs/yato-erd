<script setup lang="ts">
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  getSmoothStepPath,
  useVueFlow,
  type EdgeProps,
} from "@vue-flow/core";
import { XIcon } from "lucide-vue-next";
import { VUEFLOW_ID } from "~/constants/key";

const { findEdge, removeEdges } = useVueFlow(VUEFLOW_ID);
const props = defineProps<EdgeProps>();

const edgeParams = computed(() =>
  getEdgeParams(
    props.sourceNode,
    props.targetNode,
    extractColumnId(props.sourceHandleId),
    extractColumnId(props.targetHandleId),
  ),
);

const path = computed(() =>
  getBezierPath({
    sourceX: edgeParams.value.sx,
    sourceY: edgeParams.value.sy,
    sourcePosition: edgeParams.value.sourcePos,
    targetPosition: edgeParams.value.targetPos,
    targetX: edgeParams.value.tx,
    targetY: edgeParams.value.ty,
  }),
);

watch(
  () => props.selected,
  () => {
    const edge = findEdge(props.id);

    if (!edge) {
      return;
    }

    edge.animated = edge.selected;
  },
);
</script>

<template>
  <g>
    <BaseEdge
      :id="id"
      :style="{ ...style, strokeWidth: 2 }"
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
    <EdgeLabelRenderer>
      <div
        :class="
          cn({
            hidden: !props.selected,
          })
        "
        :style="{
          pointerEvents: 'all',
          position: 'absolute',
          transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`,
        }"
        class="nodrag nopan"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <XIcon @click="removeEdges(id)" class="w-5 h-5" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove edge</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </EdgeLabelRenderer>
  </g>
</template>
