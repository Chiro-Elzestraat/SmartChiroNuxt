<template>
  <div>
    <h1>Uitstappen</h1>
    <!-- <v-card>
      <v-card-title></v-card-title>
      <v-card-subtitle></v-card-subtitle>
      <v-img :src="uitstap.url"></v-img>
    </v-card> -->
    <v-row>
      <v-col v-for="(uitstap, index) in uitstappen" :key="index">
        <v-card class="card" max-width="400">
          <v-img
            :src="uitstap.url"
            class="white--text align-end"
            height="200px"
          >
            <v-card-title>{{ uitstap.titel }}</v-card-title>
          </v-img>

          <v-card-subtitle class="pb-0"
            >{{ uitstap.dates[0] }} t.e.m. {{ uitstap.dates[1] }}<br />Deadline
            voor inschrijven: {{ uitstap.deadline }}</v-card-subtitle
          >
          <v-card-text class="text--primary">
            {{ uitstap.beschrijving }}
            <v-row>
              <v-chip
                :color="groep.geselecteerd ? 'green' : ''"
                v-for="(groep, index) in uitstap.groepen"
                :key="index"
                class="groep"
                >{{ groep.naam }}</v-chip
              >
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-btn :to="`/uitstap/${uitstap.id}`" color="primary" text>
              {{
                $store.state.gebruiker.user.ouder ? 'Inschrijven' : 'Meer info'
              }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="toevoegen"
      v-if="leider"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" bottom right fixed color="primary" dark fab>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <NieuweUitstap
        @sluit="toevoegen = false"
        @aangemaakt="toevoegen = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import firebase from 'firebase'
import { db, storage } from '@/plugins/firebase'
import NieuweUitstap from '@/components/NieuweUitstap'
export default {
  components: {
    NieuweUitstap
  },
  data() {
    return {
      toevoegen: false,
      leider: false,
      uitstappen: [],
      nu: new Date()
    }
  },
  created() {
    firebase.auth().onAuthStateChanged((currentUser) => {
      currentUser
        .getIdTokenResult()
        .then((idTokenResult) => {
          if (idTokenResult.claims.leider) {
            this.leider = true
          }
        })
        .catch((error) => {
          console.log(error)
        })
    })
  },
  mounted() {
    db.collection('uitstap')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          storage
            .ref(`uitstap/${doc.id}`)
            .getDownloadURL()
            .then((url) => {
              console.log(url)
              this.uitstappen.push({ ...doc.data(), url, id: doc.id })
            })
            .catch(function(error) {
              console.log(error)
            })
        })
      })
    window.setInterval(() => {
      this.nu = Math.trunc(new Date().getTime() / 1000)
    }, 1000)
  },
  methods: {
    secondenNaarDhms(seconden) {
      seconden = Number(seconden)
      const d = Math.floor(seconden / (3600 * 24))
      const h = Math.floor((seconden % (3600 * 24)) / 3600)
      const m = Math.floor((seconden % 3600) / 60)
      const s = Math.floor(seconden % 60)

      const dDisplay = d > 0 ? d + (d === 1 ? ' dag, ' : ' dagen, ') : ''
      const hDisplay = h > 0 ? h + (h === 1 ? ' uur, ' : ' uren, ') : ''
      const mDisplay = m > 0 ? m + (m === 1 ? ' minuut, ' : ' minuten, ') : ''
      const sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' seconden') : ''
      return dDisplay + hDisplay + mDisplay + sDisplay
    }
  }
}
</script>

<style>
.plusknop {
  position: absolute;
  bottom: 28px;
  right: 28px;
  z-index: 1;
}
.groep {
  margin: 8px;
}
.card {
  margin: 16px;
}
</style>
