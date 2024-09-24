<script setup lang="ts">
import { ControlButton } from "@vue-flow/controls";
import { FileUpIcon } from "lucide-vue-next";

const { exportAsFile } = useExport();
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <ControlButton>
          <Button variant="outline" size="icon" @click="exportAsFile">
            <FileUpIcon class="w-4 h-4" />
          </Button>
        </ControlButton>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Export as file</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
