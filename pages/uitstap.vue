<template>
  <div>
    <h1>Uitstappen</h1>
    <v-card>
      <v-card-title>Test</v-card-title>
      <v-card-subtitle>Test</v-card-subtitle>
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
import NieuweUitstap from '@/components/NieuweUitstap'
export default {
  components: {
    NieuweUitstap
  },
  data() {
    return {
      toevoegen: false,
      leider: false
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
</style>
