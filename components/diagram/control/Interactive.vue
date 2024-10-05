<script setup lang="ts">
import { ControlButton } from "@vue-flow/controls";
import { LockKeyhole, LockKeyholeOpen } from "lucide-vue-next";

const { interactive, toggleInteractive } = useInteractive();
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <ControlButton>
          <Button variant="outline" size="icon" @click="toggleInteractive">
            <LockKeyholeOpen v-if="interactive" class="w-4 h-4" />
            <LockKeyhole v-else class="w-4 h-4" />
          </Button>
        </ControlButton>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>{{ interactive ? "Lock" : "Unlock" }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
