// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui','@pinia/nuxt','@nuxtjs/google-fonts'],
  runtimeConfig: {
    mongodb_uri: process.env.MONGODB_URI,
    jwt_secret: process.env.JWT_SECRET,
    telegram_token: "6581985549:AAF5cn-S6bLgCdYdiAXXeeKNaZp8VTU5Wmc",
    version: "0.3",
    telegram_chat_id: -4021165189,
    telegram_chat_id_test: -1002137267212/3
  },
  colorMode: {
    preference: 'light',
  },
  ssr: false,
  app: {
    baseURL: '',
  },
  googleFonts: {
    download: true,
    families: {
      'Montserrat': true,
    }
  },
  ui : {
    global : true,
    icons : ['heroicons','mingcute','guidance','ion','material-symbols']
  }
})
