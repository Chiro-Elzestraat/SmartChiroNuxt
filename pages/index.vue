<template>
  <v-container>
    <!-- <h1>Welkom op SmartChiro!</h1> -->

    <Inschrijven
      v-if="inschrijven && this.$store.state.gebruiker.user.ouder"
      v-on:ingeschreven="ingeschrevenHandler"
    />
    <div
      v-else-if="!inschrijven && this.$store.state.gebruiker.user.ouder"
      class="text-center"
    >
      <DashboardOuders :leden="leden"/>
    </div>

    <div v-else-if="!inschrijven && this.$store.state.gebruiker.user.leider">
      <DashboardLeider />
    </div>
    <v-tooltip
      v-if="this.$store.state.gebruiker.user.ouder && !inschrijven"
      left
    >
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          @click="inschrijven = true"
          fab
          color="primary"
          dark
          bottom
          fixed
          right
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Nieuwe inschrijving</span>
    </v-tooltip>
  </v-container>
</template>

<script>
  import firebase from 'firebase'
  import Inschrijven from '@/components/Inschrijven'
  import DashboardLeider from '@/components/DashboardLeider'
  import { db } from '@/plugins/firebase'
  import DashboardOuders from '~/pages/DashboardOuders'

  export default {
  components: {
    DashboardOuders,
    Inschrijven,
    DashboardLeider
  },
  data() {
    return {
      inschrijven: false,
      leden: []
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      this.getLeden()
    })
  },
  methods: {
    getLeden() {
      if(this.$store.state.gebruiker.user.data.uid !== undefined){
        db.collection('leden')
          .where(
            'ouderId',
            'array-contains',
            this.$store.state.gebruiker.user.data.uid
          )
          .get()
          .then((snap) => {
            this.leden = snap.docs.map((item) => {
              return { ...item.data(), lidId: item.id }
            })
          })
      }
    },
    ingeschrevenHandler() {
      this.inschrijven = false
      this.getLeden()
    }
  },
  beforeRouteLeave(to, from, next) {
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
    if (!this.inschrijven) next()
    else {
      const answer = window.confirm(
        'Jouw inschrijving is nog niet opgeslagen. Weet je zeker dat je deze pagina wil verlaten?'
      )
      if (answer) {
        next()
      } else {
        next(false)
      }
    }
  },
  head() {
    return {
      title: 'Dashboard'
    }
  }
}
</script>

