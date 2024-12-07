<script setup lang="ts">
import { ControlButton } from "@vue-flow/controls";
import { useVueFlow } from "@vue-flow/core";
import { FileJson, FileUpIcon, Image } from "lucide-vue-next";
import { VUEFLOW_ID } from "~/constants/key";

const { getSelectedNodes } = useVueFlow(VUEFLOW_ID);

const emit = defineEmits<{
  (e: "setSettingOpen", open: boolean): void;
}>();

const setSettingOpen = (open: boolean): void => {
  emit("setSettingOpen", open);
};

const closeSetting = (): void => {
  setSettingOpen(false);
};

const { exportAsJson, exportAsImage } = useExport();
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <ControlButton>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button
                variant="outline"
                size="icon"
                @click="setSettingOpen(true)"
              >
                <FileUpIcon class="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="left" prioritize-position>
              <DropdownMenuItem
                class="flex gap-2"
                @click="
                  () => {
                    exportAsJson();
                    closeSetting();
                  }
                "
              >
                <FileJson class="h-4 w-4" />Export as json</DropdownMenuItem
              >
              <DropdownMenuItem
                class="flex gap-2"
                @click="
                  () => {
                    exportAsImage({
                      type: 'png',
                      quality: 1,
                      shouldDownload: true,
                    });
                    closeSetting();
                  }
                "
              >
                <Image class="h-4 w-4" />Export as png</DropdownMenuItem
              >
              <DropdownMenuItem
                class="flex gap-2"
                @click="
                  () => {
                    exportAsImage({
                      type: 'jpeg',
                      quality: 1,
                      shouldDownload: true,
                    });
                    closeSetting();
                  }
                "
              >
                <Image class="h-4 w-4" />Export as jpeg</DropdownMenuItem
              >
              <DropdownMenuItem
                class="flex gap-2"
                @click="
                  () => {
                    exportAsImage({
                      type: 'svg',
                      quality: 1,
                      shouldDownload: true,
                    });
                    closeSetting();
                  }
                "
              >
                <Image class="h-4 w-4" />Export as svg</DropdownMenuItem
              >
              <template v-if="getSelectedNodes.length > 0">
                <DropdownMenuItem
                  class="flex gap-2"
                  @click="
                    () => {
                      exportAsImage({
                        type: 'png',
                        quality: 1,
                        shouldDownload: true,
                        onlySelectedNodes: true,
                      });
                      closeSetting();
                    }
                  "
                >
                  <Image class="h-4 w-4" />Export selected nodes as
                  png</DropdownMenuItem
                >
                <DropdownMenuItem
                  class="flex gap-2"
                  @click="
                    () => {
                      exportAsImage({
                        type: 'jpeg',
                        quality: 1,
                        shouldDownload: true,
                        onlySelectedNodes: true,
                      });
                      closeSetting();
                    }
                  "
                >
                  <Image class="h-4 w-4" />Export selected nodes as
                  jpeg</DropdownMenuItem
                >
                <DropdownMenuItem
                  class="flex gap-2"
                  @click="
                    () => {
                      exportAsImage({
                        type: 'svg',
                        quality: 1,
                        shouldDownload: true,
                        onlySelectedNodes: true,
                      });
                      closeSetting();
                    }
                  "
                >
                  <Image class="h-4 w-4" />Export selected nodes as
                  svg</DropdownMenuItem
                >
              </template>
            </DropdownMenuContent>
          </DropdownMenu>
        </ControlButton>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Export as</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
