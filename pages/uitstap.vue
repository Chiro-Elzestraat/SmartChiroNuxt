<template>
  <div>
    <h1>Uitstappen</h1>
    <!-- <v-card>
      <v-card-title></v-card-title>
      <v-card-subtitle></v-card-subtitle>
      <v-img :src="uitstap.url"></v-img>
    </v-card> -->
    <v-card
      class="card"
      max-width="400"
      v-for="(uitstap, index) in uitstappen"
      :key="index"
    >
      <v-img class="white--text align-end" height="200px" :src="uitstap.url">
        <v-card-title>{{ uitstap.titel }}</v-card-title>
      </v-img>

      <v-card-subtitle class="pb-0"
        >{{ uitstap.dates[0] }} - {{ uitstap.dates[1] }}</v-card-subtitle
      >

      <v-card-text class="text--primary">
        {{ uitstap.beschrijving }}
        <v-row>
          <v-chip
            class="groep"
            :color="groep.geselecteerd ? 'green' : ''"
            @click="groep.geselecteerd = !groep.geselecteerd"
            v-for="(groep, index) in uitstap.groepen"
            :key="index"
            >{{ groep.naam }}</v-chip
          >
        </v-row>
      </v-card-text>

      <!-- <v-card-actions>
        <v-btn color="orange" text>
          Share
        </v-btn>

        <v-btn color="orange" text>
          Explore
        </v-btn>
      </v-card-actions> -->
    </v-card>
    <v-dialog
      v-model="toevoegen"
      v-if="leider"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on }">
        <v-btn class="plusknop" color="primary" v-on="on" dark fab>
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
      uitstappen: []
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
              this.uitstappen.push({ ...doc.data(), url })
            })
            .catch(function(error) {
              console.log(error)
            })
        })
      })
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
