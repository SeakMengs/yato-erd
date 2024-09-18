<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { THEME } from "~/types/theme";

const colorMode = useColorMode();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="icon">
        <Icon
          icon="radix-icons:moon"
          class="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        />
        <Icon
          icon="radix-icons:sun"
          class="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent side="left" align="end">
      <DropdownMenuItem @click="colorMode.preference = THEME.LIGHT">
        Light
      </DropdownMenuItem>
      <DropdownMenuItem @click="colorMode.preference = THEME.DARK">
        Dark
      </DropdownMenuItem>
      <DropdownMenuItem @click="colorMode.preference = THEME.SYSTEM">
        System
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
