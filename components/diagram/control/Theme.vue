<script setup lang="ts">
import { ControlButton } from "@vue-flow/controls";
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <ControlButton>
          <ThemeButton />
        </ControlButton>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Change theme</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
