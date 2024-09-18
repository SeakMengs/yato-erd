<script setup lang="ts">
import { ControlButton } from "@vue-flow/controls";
import { Save } from "lucide-vue-next";

const erdState = useErd();
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <ControlButton>
          <Button
            variant="outline"
            size="icon"
            @click="erdState.saveErdStateToLocalStorage"
          >
            <Save class="w-4 h-4" />
          </Button>
        </ControlButton>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Save state</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
