<template>
  <v-container>
    <h1>Uitstappen</h1>
    <v-switch v-model="toonAfgelopen" label="Toon gepasseerde uitstappen"></v-switch>
    <!-- <v-card>
      <v-card-title></v-card-title>
      <v-card-subtitle></v-card-subtitle>
      <v-img :src="uitstap.url"></v-img>
    </v-card> -->
    <v-row>
      <v-col v-for="(uitstap, index) in alleUitstappen" :key="index">
        <v-card class="card" max-width="400">
          <v-img
            :src="uitstap.url"
            class="white--text align-end"
            height="200px"
          >
            <v-card-title>{{ uitstap.titel }}</v-card-title>
          </v-img>

          <v-card-subtitle class="pb-0"
            ><span v-if="uitstap.isKamp">Speelclub: {{uitstap.datesSpeelclub[0]}} t.e.m. {{uitstap.datesSpeelclub[1]}}<br /></span>{{ uitstap.dates[0] }} t.e.m. {{ uitstap.dates[1] }}<br />Deadline
            voor inschrijven: {{ uitstap.deadline }}</v-card-subtitle
          >
          <v-card-text class="text--primary">
            {{ uitstap.beschrijving }}
            <v-row style="margin-top: 16px">
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
        @aangemaakt="aangemaakt"
      />
    </v-dialog>
  </v-container>
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
      nu: new Date(),
      toonAfgelopen: false,
    }
  },
  computed: {
    gepasseerd() {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      let result = this.uitstappen.filter(u => new Date(u.deadline) < date)
      result = result === undefined ? [] : result
      return result
    },
    opkomend(){
      const date = new Date()
      date.setDate(date.getDate() - 1)
      let result = this.uitstappen.filter(u => (this.leider ? new Date(u.dates[1]) : new Date(u.deadline)) >= date)
      result = result === undefined ? [] : result
      return result
    },
    alleUitstappen(){
      const result = []
      if(this.opkomend.length > 0)
      result.push(...this.opkomend)
      if(this.toonAfgelopen && this.gepasseerd.length > 0){
        result.push(...this.gepasseerd)
      }
      return result
    }
  },
  created() {
    firebase.auth().onAuthStateChanged((currentUser) => {
      currentUser
        .getIdTokenResult()
        .then((idTokenResult) => {
          if (idTokenResult.claims.rollen.leider) {
            this.leider = true
          }
        })
        .catch((error) => {
          console.warn(error)
        })
    })
  },
  mounted() {
    this.haalUitstappenOp()
    window.setInterval(() => {
      this.nu = Math.trunc(new Date().getTime() / 1000)
    }, 1000)
  },
  methods: {
    aangemaakt(){
      this.toevoegen = false
      this.haalUitstappenOp()
    },
    haalUitstappenOp(){
      this.uitstappen = []
      db.collection('uitstap')
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            storage
              .ref(`uitstap/${doc.id}`)
              .getDownloadURL()
              .then((url) => {
                this.uitstappen.push({ ...doc.data(), url, id: doc.id })
              })
              .catch(function(error) {
                console.warn(error)
              })
          })
        })
    },
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
