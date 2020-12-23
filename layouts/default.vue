<template>
  <v-app dark>
    <v-navigation-drawer
      v-if="
        this.$store.state.gebruiker.user.isLoggedIn &&
          !this.$store.state.gebruiker.user.nieuweGebruiker
      "
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in menuItems"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"/>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="swapTheme()">
          <v-list-item-icon
          >
            <v-icon v-if="!this.$vuetify.theme.dark">mdi-lightbulb
            </v-icon
            >
            <v-icon v-else>mdi-lightbulb-outline</v-icon>
          </v-list-item-icon
          >
          <v-list-item-content>
            <v-list-item-title>Donkere modus</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        v-if="
          this.$store.state.gebruiker.user.isLoggedIn &&
            !this.$store.state.gebruiker.user.nieuweGebruiker
        "
      />
      <v-toolbar-title v-text="title"/>
      <v-spacer/>
      <img
        v-if="this.$store.state.gebruiker.user.isLoggedIn"
        :src="this.$store.state.gebruiker.user.data.photoURL"
        class="profielfoto"
        height="100%"
      />
      <v-progress-linear
        :active="
          !this.$store.state.gebruiker.user.isLoggedIn &&
          this.$store.state.gebruiker.user.data
        "
        indeterminate
        absolute
        bottom
        color="primary"
      />
    </v-app-bar>
    <v-content>
      <nuxt/>
    </v-content>
    <v-overlay
      :value="
        !this.$store.state.gebruiker.user.isLoggedIn &&
         this.$store.state.gebruiker.user.data
      "
    >
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
  import firebase from 'firebase'
  // import { db } from '../plugins/firebase'
  export default {
    data() {
      return {
        clipped: false,
        drawer: false,
        fixed: false,
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'SmartChiro'
      }
    },
    computed: {
      isLeider() {
        return this.$store.state.gebruiker.user.leider
      },
      isGroepsleiderOfWebsite() {
        return this.$store.state.gebruiker.user.groepsleider || this.$store.state.gebruiker.user.website
      },
      menuItems() {
        return this.$store.state.menu.items.filter((item) => {
          return !item.rol || (item.rol === 'leider' && this.isLeider || item.rol === 'groepsleiderOfWebsite' && this.isGroepsleiderOfWebsite)
        })
      }
    },
    created() {
      firebase.auth().onAuthStateChanged((user) => {
        this.$store.dispatch('gebruiker/fetchUser', user)
        if (firebase
          .auth()
          .currentUser !== null) {
          const token = `Bearer ${firebase
            .auth()
            .currentUser.ya}`
          this.$axios.setHeader('Authorization', token)
          firebase
            .auth()
            .currentUser.getIdTokenResult()
            .then((idTokenResult) => {
              if (idTokenResult.claims.rollen === undefined) {
                this.$store.commit('gebruiker/setNieuweGebruiker', true)
                this.$router.push('/account')
              } else if (idTokenResult.claims.rollen) {
                for (const claim in idTokenResult.claims.rollen) {
                  this.$store.commit('gebruiker/setClaim', claim)
                }
              }
              if (!idTokenResult.claims.rollen || !idTokenResult.claims.rollen.leider)
                this.$store.commit('gebruiker/setOuder', true)
            })
            .catch((error) => {
              console.warn(error)
              this.$store.commit('gebruiker/setNieuweGebruiker', false)
              this.$router.push('/account')
            })
        } else {
          this.$router.push('/account')
        }
      })
      if (localStorage.getItem('dark') === 'false') this.setTheme(false)
    },
    mounted() {
    },
    methods: {
      swapTheme() {
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark
        localStorage.setItem('dark', this.$vuetify.theme.dark)
      },
      setTheme(dark) {
        this.$vuetify.theme.dark = dark
      }
    }
  }
</script>

<style>
  .profielfoto {
    border-radius: 50%;
  }
</style>
