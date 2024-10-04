<script setup lang="ts">
import { ControlButton } from "@vue-flow/controls";
import { ImageUpIcon } from "lucide-vue-next";

const { exportAsImage } = useExport();
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <ControlButton>
          <Button
            variant="outline"
            size="icon"
            @click="
              exportAsImage({
                type: 'png',
                quality: 1,
                shouldDownload: true,
              })
            "
          >
            <ImageUpIcon class="w-4 h-4" />
          </Button>
        </ControlButton>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Export as png</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
