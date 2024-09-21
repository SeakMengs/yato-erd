<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ControlButton } from "@vue-flow/controls";
import { THEME } from "~/types/theme";

const colorMode = useColorMode();

const toggleTheme = () => {
  colorMode.preference =
    colorMode.value === THEME.DARK ? THEME.LIGHT : THEME.DARK;
};
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <ControlButton>
          <Button variant="outline" size="icon" @click="toggleTheme">
            <Icon
              icon="radix-icons:moon"
              class="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            />
            <Icon
              icon="radix-icons:sun"
              class="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
          </Button>
        </ControlButton>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Change theme</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
