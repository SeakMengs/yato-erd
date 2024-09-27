<script setup lang="ts">
import { ControlButton } from "@vue-flow/controls";
import { FileUpIcon } from "lucide-vue-next";

const { exportAsJson } = useExport();
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <ControlButton>
          <Button variant="outline" size="icon" @click="exportAsJson">
            <FileUpIcon class="w-4 h-4" />
          </Button>
        </ControlButton>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Export as json file</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
