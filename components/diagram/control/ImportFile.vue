<script setup lang="ts">
import { ControlButton } from "@vue-flow/controls";
import { FileDownIcon } from "lucide-vue-next";

const { importFromJson } = useImport();
const fileRef = ref<HTMLInputElement | null>(null);

const onButtonClick = (): void => {
  if (!fileRef.value) {
    return;
  }

  fileRef.value.click();
};

const handleFileUpload = (event: Event): void => {
  const el = event.target as HTMLInputElement;

  if (el.files && el.files[0]) {
    importFromJson(el.files[0]);
  }
};
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <ControlButton>
          <Button variant="outline" size="icon" @click="onButtonClick">
            <FileDownIcon class="w-4 h-4" />
            <input
              class="hidden"
              type="file"
              accept="application/json"
              hidden
              ref="fileRef"
              @input="handleFileUpload"
            />
          </Button>
        </ControlButton>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Import from json file</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
