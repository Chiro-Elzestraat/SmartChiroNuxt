// import path from 'path'
import fs from 'fs'
import colors from 'vuetify/es5/util/colors'
import nl from 'vuetify/es5/locale/nl'

const vuetify = {
  lang: {
    locales: {nl},
    current: 'nl',
  },
  customVariables: ['~/assets/variables.scss'],
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#DD042B',
        accent: colors.red.darken3,
        secondary: colors.amber.darken3,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.darken1
      },
      light: {
        primary: '#DD042B'
      }
    }
  }
}

require('dotenv').config()

const PRODUCTION_URL = 'https://api.chiroelzestraat.be/'
const DEV_URL = 'https://localhost:6001/'
const BASE_URL = process.env.NODE_ENV !== 'production' ? DEV_URL : PRODUCTION_URL

export default {
  generate: {
    fallback: true
  },
  router: {
    mode: 'hash',
    middleware: ['check-auth'],
  },
  server: {
    https: {
      key: process.env.NODE_ENV !== 'production' ? fs.readFileSync('./server.key') : '',
      cert: process.env.NODE_ENV !== 'production' ? fs.readFileSync('./server.crt') : ''
    }
  },
  ssr: false,
  env: {
    DEV: process.env.NODE_ENV !== 'production',
  },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + 'SmartChiro',
    title: 'SmartChiro' || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/icon.png' }]
  },
  pwa: {
    manifest: {
      name: 'SmartChiro',
      short_name: 'SmartChiro',
      lang: 'nl',
      theme_color: vuetify.theme.dark ? colors.grey.darken4 : colors.white // TODO: dit moet nog dynamisch, dus als het thema verandert, moet ook die bovenste balk van kleur veranderen
    }
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{src: '~/plugins/firebase.js'},  { src: '~/plugins/pwa-update.js', mode: 'client' }, {src: '~/plugins/open-path.js', mode: 'client'}],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/device'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: BASE_URL,
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify,
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
