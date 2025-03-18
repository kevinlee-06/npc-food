// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  modules: [
    '@vueuse/nuxt',
    'radix-vue/nuxt',
    'unplugin-icons/nuxt',
    '@nuxtjs/leaflet',
  ],
  postcss: {
    plugins: {
      'postcss-nesting': {},
    },
  },
})
