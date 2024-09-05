<script setup lang="ts">
import { useToast } from "./components/ui/toast";
import { errorHandler } from "./utils/error";

// Read more: https://nuxt.com/docs/getting-started/seo-meta#title-template
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - YatoERD` : "YatoERD";
  },
});
const { toast } = useToast();

onErrorCaptured((error) => errorHandler(error));
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
    <Toaster />
  </NuxtLayout>
</template>

<style lang="css">
html,
body,
#__nuxt,
#__layout {
  height: 100% !important;
  width: 100% !important;
}
</style>
