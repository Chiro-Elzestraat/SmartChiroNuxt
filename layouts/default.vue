<template>
  <v-app dark>
    <v-navigation-drawer
      v-if="this.$store.state.gebruiker.user.isLoggedIn"
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="swapTheme()">
          <v-list-item-icon
            ><v-icon v-if="!this.$vuetify.theme.dark">mdi-lightbulb</v-icon
            ><v-icon v-else>mdi-lightbulb-outline</v-icon></v-list-item-icon
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
        v-if="this.$store.state.gebruiker.user.isLoggedIn"
      />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <img
        v-if="this.$store.state.gebruiker.user.isLoggedIn"
        :src="this.$store.state.gebruiker.user.data.photoURL"
        class="profielfoto"
        height="100%"
      />
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
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
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/' },
        { title: 'Mijn account', icon: 'mdi-account', to: '/account' },
        { title: 'Instellingen', icon: 'mdi-settings', to: '/instellingen' }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'SmartChiro'
    }
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      this.$store.dispatch('gebruiker/fetchUser', user)
    })
    if (localStorage.getItem('dark') === 'false') this.setTheme(false)
    const getAlleLeden = firebase.functions().httpsCallable('getAlleLeden')
    getAlleLeden().then((result) => console.log(result.data))
  },
  mounted() {
    console.log(this.items)
    const getMenu = firebase.functions().httpsCallable('getMenu')
    getMenu().then((result) => {
      console.log(result.data)
      if (result.data) this.addMenuItems(result.data)
    })
  },
  methods: {
    swapTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      localStorage.setItem('dark', this.$vuetify.theme.dark)
    },
    setTheme(dark) {
      this.$vuetify.theme.dark = dark
    },
    addMenuItems(data) {
      this.items = [data, ...this.items]
    }
  }
}
</script>

<style>
.profielfoto {
  border-radius: 50%;
}
</style>
