<script setup lang="ts">
const { locale, setLocale } = useI18n();
</script>

<template>
  <div>
    <Button>
      <NuxtLink to="/diagram">To diagram</NuxtLink>
    </Button>
    <div>
      <Button @click="setLocale('en')">en</Button>
      <Button @click="setLocale('kh')">kh</Button>
      <Button @click="console.log(locale)">See locale</Button>
      <p>{{ $t("home") }}</p>
    </div>
  </div>
</template>
