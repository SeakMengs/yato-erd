<script setup lang="ts">
import { errorHandler } from "./utils/error";

// Read more: https://nuxt.com/docs/getting-started/seo-meta#title-template
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - YatoERD` : "YatoERD";
  },
});

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
