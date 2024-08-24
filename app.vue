<script setup lang="ts">
// Read more: https://nuxt.com/docs/getting-started/seo-meta#title-template
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - YatoERD` : "YatoERD";
  },
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
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
