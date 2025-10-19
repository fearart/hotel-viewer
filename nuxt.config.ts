// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui','@pinia/nuxt','@nuxtjs/google-fonts'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    mongodb_uri: process.env.MONGODB_URI,
    jwt_secret: process.env.JWT_SECRET,
    telegram_token: process.env.TELEGRAM_TOKEN,
    version: "0.3",
    telegram_chat_id: -4021165189,
    telegram_chat_id_test: -10021372672123
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
  },

  nitro : {
    storage : {
       images : {
          driver : "fsLite",
      base : "./images"
       }
    }	  
  },
})
