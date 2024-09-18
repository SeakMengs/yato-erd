<script setup lang="ts">
import { ControlButton } from "@vue-flow/controls";
import { useVueFlow } from "@vue-flow/core";
import { Scan } from "lucide-vue-next";
import { VUEFLOW_ID } from "~/constants/key";

const { fitView } = useVueFlow(VUEFLOW_ID);
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <ControlButton>
          <Button variant="outline" size="icon" @click="fitView">
            <Scan class="w-4 h-4" />
          </Button>
        </ControlButton>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Fit view</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
