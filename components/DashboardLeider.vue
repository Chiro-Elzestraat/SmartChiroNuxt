<template>
  <div>
    <v-row dense>
      <template v-for="card in cards">
        <v-col v-if="!card.rol || rollen.includes(card.rol)" :key="card.title">
          <v-card
            class="mx-auto"
            @click="$router.push(card.page)"
            width="400px"
          >
            <v-img :src="card.src" height="200px" width="400px" contain></v-img>
            <v-card-title v-text="card.title"></v-card-title>
            <v-card-actions class="justify-center">
              <v-btn outlined color="primary" text>Ga naar</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </div>
</template>
<script>
import firebase from 'firebase'
export default {
  data() {
    return {
      cards: [
        {
          title: 'Financiën',
          icon: 'mdi-dashboard',
          src: '/financien.svg',
          page: '/finance',
          rol: 'kas'
        },
        {
          title: 'Verhuur',
          icon: 'mid-account_box',
          src: '/verhuur.svg',
          page: '/verhuur'
        },
        {
          title: 'Evenementen',
          icon: 'mid-gavel',
          src: '/evenementen.svg',
          page: '/events'
        },
        {
          title: 'Uitstappen',
          icon: 'mdi-dashboard',
          src: '/uitstap.svg',
          page: '/uitstap'
        }
      ],
      rollen: []
    }
  },
  created() {
    firebase
      .auth()
      .currentUser.getIdTokenResult()
      .then((idTokenResult) => {
        if (idTokenResult.claims.kas) {
          // Show admin UI.
          this.rollen.push('kas')
        } else {
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
</script>
