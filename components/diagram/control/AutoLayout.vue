<script setup lang="ts">
import { ControlButton } from "@vue-flow/controls";
import { useVueFlow } from "@vue-flow/core";
import {
  ArrowLeft,
  LayoutDashboard,
  MoveDown,
  MoveLeft,
  MoveRight,
  MoveUp,
} from "lucide-vue-next";
import { VUEFLOW_ID } from "~/constants/key";

const { getNodes, getEdges, setNodes } = useVueFlow(VUEFLOW_ID);
const { layout } = useLayout();
const { interactive } = useInterative();
const { smoothFitView } = useVueFlowUtils();

const emit = defineEmits<{
  (e: "setSettingOpen", open: boolean): void;
}>();

const setSettingOpen = (open: boolean): void => {
  emit("setSettingOpen", open);
};

const closeSetting = (): void => {
  setSettingOpen(false);
};

const layoutLR = (): void => {
  if (!interactive) {
    return;
  }

  setNodes(layout(getNodes.value, getEdges.value, "LR"));
  closeSetting();
  smoothFitView();
};

const layoutRL = (): void => {
  if (!interactive) {
    return;
  }

  setNodes(layout(getNodes.value, getEdges.value, "RL"));
  closeSetting();
  smoothFitView();
};

const layoutBT = (): void => {
  if (!interactive) {
    return;
  }

  setNodes(layout(getNodes.value, getEdges.value, "BT"));
  closeSetting();
  smoothFitView();
};

const layoutTB = (): void => {
  if (!interactive) {
    return;
  }

  setNodes(layout(getNodes.value, getEdges.value, "TB"));
  closeSetting();
  smoothFitView();
};
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <ControlButton>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button
                variant="outline"
                size="icon"
                @click="setSettingOpen(true)"
              >
                <LayoutDashboard class="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="left" prioritize-position>
              <DropdownMenuItem class="flex gap-2" @click="layoutLR">
                <MoveRight class="h-4 w-4" /> Left to right</DropdownMenuItem
              >
              <DropdownMenuItem class="flex gap-2" @click="layoutRL">
                <MoveLeft class="h-4 w-4" /> Right to left</DropdownMenuItem
              >
              <DropdownMenuItem class="flex gap-2" @click="layoutBT">
                <MoveUp class="h-4 w-4" /> Bottom to top</DropdownMenuItem
              >
              <DropdownMenuItem class="flex gap-2" @click="layoutTB">
                <MoveDown class="h-4 w-4" /> Top to bottom</DropdownMenuItem
              >
            </DropdownMenuContent>
          </DropdownMenu>
        </ControlButton>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Format nodes</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
