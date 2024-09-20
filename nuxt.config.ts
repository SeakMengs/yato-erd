// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-09-11",
  devtools: { enabled: true },
  runtimeConfig: {
    WEB_RTC_SIGNAL: import.meta.env.WEB_RTC_SIGNAL,
    WS_URL: import.meta.env.WS_URL,
    public: {
      WS_URL: import.meta.env.WS_URL,
      WEB_RTC_SIGNAL: import.meta.env.WEB_RTC_SIGNAL,
    },
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "shadcn-nuxt",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
    "@nuxt/test-utils/module",
  ],
  i18n: {
    vueI18n: "./config/i18n.config.ts",
  },
  colorMode: {
    classSuffix: "",
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  components: [{ path: "~/components", pathPrefix: true }],
});

