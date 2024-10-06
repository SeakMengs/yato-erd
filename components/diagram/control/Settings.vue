<script setup lang="ts">
import { ControlButton } from "@vue-flow/controls";
import { Menu } from "lucide-vue-next";

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
      class="flex flex-col gap-1 overflow-hidden transition-all duration-300 opacity-0 max-h-0 ease-out"
      :class="{
        'opacity-100 max-h-96 ease-in': isOpen,
        // 'group-hover:opacity-100 group-hover:max-h-96 ': !isOpen,
      }"
    >
      <DiagramControlTheme />
      <DiagramControlImportFile />
      <DiagramControlExportAs @set-setting-open="setSettingOpen" />
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
              <Menu class="w-4 h-4" />
            </Button>
          </ControlButton>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Menus</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>
