<script setup lang="ts">
import { ControlButton } from "@vue-flow/controls";
import { Settings } from "lucide-vue-next";

const isOpen = ref<boolean>(false);

const toggleSettings = () => {
  isOpen.value = !isOpen.value;
};

const setSettingOpen = (open: boolean): void => {
  isOpen.value = open;
};
</script>

<template>
  <div class="group flex flex-col gap-1">
    <div
      class="flex flex-col gap-1 overflow-hidden transition-all duration-300"
      :class="{
        'opacity-100 max-h-96 ease-in': isOpen,
        'opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-96 ease-out':
          !isOpen,
      }"
    >
      <DiagramControlTheme />
      <DiagramControlExportImage />
      <DiagramControlExportFile />
      <DiagramControlImportFile />
      <DiagramControlFitView />
      <DiagramControlInteractive />
      <DiagramControlAutoLayout @set-setting-open="setSettingOpen" />
      <DiagramControlSave />
    </div>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <ControlButton class="z-10">
            <Button
              variant="outline"
              size="icon"
              @click="toggleSettings"
              :class="{
                'text-accent-foreground bg-accent': isOpen,
              }"
            >
              <Settings class="w-4 h-4" />
            </Button>
          </ControlButton>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Settings</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>
