// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  ssr: false,
  srcDir: "app/",

  app: {
    baseURL: "/canglish/",
    buildAssetsDir: "/_nuxt/",
    head: {
      title: "Canglish - Learn Cantonese",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "Learn Cantonese using English phonetics",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/canglish/favicon.ico" },
      ],
    },
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
  },

  modules: ["@nuxt/ui"],

  css: ["~/assets/css/main.css"],

  nitro: {
    preset: "static",
  },
});
