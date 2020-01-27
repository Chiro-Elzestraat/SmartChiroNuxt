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
  }
}
</script>

<style>
.profielfoto {
  border-radius: 50%;
}
</style>
