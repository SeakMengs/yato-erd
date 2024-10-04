<script setup lang="ts">
import { ControlButton } from "@vue-flow/controls";
import { Scan } from "lucide-vue-next";

const { smoothFitView } = useVueFlowUtils();
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <ControlButton>
          <Button variant="outline" size="icon" @click="smoothFitView">
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
