// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  runtimeConfig: {
    mongodb_uri: "mongodb+srv://tato:admin@cluster0.sz9vy3k.mongodb.net/?retryWrites=true&w=majority",
    jwt_secret: "1b85365bf12070b301479f4f7e26ba1f76108c0a661b97938a89307a3b5e10fc",
    telegram_token: "6581985549:AAFIVOw-49ZgbxDIxHoKLAlvH6HOgGlLWOM",
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
