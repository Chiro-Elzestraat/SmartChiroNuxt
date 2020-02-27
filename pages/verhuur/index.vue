<template>
  <div>
    <h1>Verhuur</h1>
    <!-- <v-card>
      <v-card-title></v-card-title>
      <v-card-subtitle></v-card-subtitle>
      <v-img :src="uitstap.url"></v-img>
    </v-card>-->
    <v-container>
      <v-row>
        <v-col><v-row v-for="(verhuur, index) in verhuurdGesorteerd" :key="index">
      <v-col>
        <v-card class="card" max-width="400">
          <v-card-title>
            {{ new Date(verhuur.dates[0]).toLocaleDateString('nl', datumOpties) }}
            - {{ new Date(verhuur.dates[1]).toLocaleDateString('nl', datumOpties) }}
          </v-card-title>
          <v-card-subtitle class="pb-6">{{ verhuur.huurder.vereniging }}</v-card-subtitle>
          <v-card-text class="text--primary">
            Contactpersoon: {{ verhuur.huurder.naam }}<v-spacer />Gsm: {{ verhuur.huurder.gsm }}
          </v-card-text>
          <v-card-text class="text--primary">
            Opmerking:
            {{ verhuur.opmerking }}
          </v-card-text>

          <!--<v-card-actions>
            <v-btn :to="`/uitstap/${uitstap.id}`" color="primary" text>
              Inschrijven
            </v-btn>
          </v-card-actions>-->
        </v-card>
      </v-col>
    </v-row></v-col>
        <v-col><Agenda /></v-col>
        </v-row>
    </v-container>
    
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
      <Verhuur
        @terug="toevoegen = false"
        @sluit="toevoegen = false"
        @aangemaakt="toevoegen = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import firebase from 'firebase'
import { db } from '@/plugins/firebase'
import Verhuur from '@/components/Verhuur'
import Agenda from '@/components/Agenda'

export default {
  components: {
    Verhuur,
    Agenda
  },
  data() {
    return {
      toevoegen: false,
      leider: false,
      verhuurd: [],
      datumOpties: {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
    }
  },
  computed: {
    verhuurdGesorteerd() {
      const verhuurdNietGesorteerd = this.verhuurd
      return verhuurdNietGesorteerd.sort((a, b) => {
        if (a.dates[0] < b.dates[0]) {
          return -1
        } else if (a.dates[0] === b.dates[0]) {
          return 0
        } else {
          return 1
        }
      })
    },
    verhuurPerDatum(){
      const result = {}
      this.verhuurdGesorteerd.forEach(verhuur => {
        result[verhuur.dates[0]] = verhuur
      })
      return result
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
    db.collection('verhuur')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => this.verhuurd.push(doc.data()))
      })
    // .then((snapshot) => {
    /* snapshot.forEach((doc) => {
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
        }) */
    // })
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
