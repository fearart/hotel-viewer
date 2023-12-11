// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  runtimeConfig: {
    mongodb_uri: process.env.MONGODB_URI,
    jwt_secret: process.env.JWT_SECRET,
    port: 3030,
  },
  colorMode: {
    preference: 'light',
  },
  ssr: false,
  app: {
    baseURL: '',
  },
})
