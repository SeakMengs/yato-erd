<script setup lang="ts">
import { ControlButton } from "@vue-flow/controls";
import { useVueFlow } from "@vue-flow/core";
import { LockKeyhole, LockKeyholeOpen } from "lucide-vue-next";
import { VUEFLOW_ID } from "~/constants/key";

const { setInteractive } = useVueFlow(VUEFLOW_ID);
const interactive = ref<boolean>(true);

const toggleInteractive = () => {
  interactive.value = !interactive.value;
  setInteractive(interactive.value);
};
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
