// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  pages: true,
  modules: ['@nuxt/fonts', '@pinia/nuxt'],
  fonts: {
    families: [
      { name: 'Outfit', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] }
    ]
  },
  css: ['@/assets/styles/main.sass'],
})
