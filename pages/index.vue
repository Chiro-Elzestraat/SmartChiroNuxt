<template>
  <div>
    <!-- <h1>Welkom op SmartChiro!</h1> -->

    <Inschrijven
      v-if="inschrijven && this.$store.state.gebruiker.user.ouder"
      v-on:ingeschreven="ingeschrevenHandler"
    />
    <div
      v-else-if="!inschrijven && this.$store.state.gebruiker.user.ouder"
      class="text-center"
    >
      <div v-if="leden.length === 0">
        <img src="../assets/geenleden.svg" alt="Geen leden" class="geenleden" />
        <h1 class="headline">Hier is niets te zien</h1>
        <p>Ingeschreven leden verschijnen hier.</p>
        <p>
          Waren je leden al ingeschreven in het vorige systeem?
          <a @click="$router.push('overzetten')">Klik dan hier</a> om de
          gegevens over te zetten.
        </p>
      </div>
      <div v-else>
        <v-expansion-panels>
          <v-expansion-panel v-for="(lid, index) in leden" :key="index">
            <v-expansion-panel-header>{{ lid.naam }}</v-expansion-panel-header>
            <v-expansion-panel-content
              ><BewerkLidInfo :lidProp="lid"/><LidInfo :lid="lid"
            /></v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </div>

    <div v-else-if="!inschrijven && this.$store.state.gebruiker.user.leider">
      <DashboardLeider />
    </div>
    <v-tooltip
      left
      v-if="this.$store.state.gebruiker.user.ouder && !inschrijven"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          fab
          color="primary"
          dark
          v-on="on"
          class="plusknop"
          @click="inschrijven = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Nieuwe inschrijving</span>
    </v-tooltip>
  </div>
</template>

<script>
import firebase from 'firebase'
import Inschrijven from '@/components/Inschrijven'
import LidInfo from '@/components/LidInfo'
import BewerkLidInfo from '@/components/BewerkLidInfo'
import DashboardLeider from '@/components/DashboardLeider'
import { db } from '@/plugins/firebase'
export default {
  components: {
    Inschrijven,
    LidInfo,
    DashboardLeider,
    BewerkLidInfo
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

<style scoped>
.geenleden {
  display: block;
  margin: 0 auto;
  max-width: 40%;
}
.plusknop {
  position: absolute;
  bottom: 28px;
  right: 28px;
  z-index: 1;
}
</style>
