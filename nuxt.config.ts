// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  runtimeConfig: {
    mongodb_uri: process.env.MONGODB_URI,
    jwt_secret: process.env.JWT_SECRET,
    telegram_token: process.env.TELEGRAM_TOKEN,
    version: "0.3",
    telegram_chat_id: -4021165189,
  },
  colorMode: {
    preference: 'light',
  },
  ssr: false,
  app: {
    baseURL: '',
  },
})
