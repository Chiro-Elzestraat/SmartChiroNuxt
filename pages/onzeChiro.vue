<template>
<div>
  <v-row>
    <v-col cols="4">
      <ledenaantallen />
    </v-col>
  </v-row>
    <v-row>
      <v-col v-for="(card, index) in cardsFiltered" :key="index">
        <v-card
          class="mx-auto"
          max-width="400"
          @click="$router.push(card.page)"
        >
          <v-img :src="card.src" height="200px" width="400px" contain></v-img>
          <v-card-title v-text="card.title"></v-card-title>
          <v-card-actions class="justify-center">
            <v-btn outlined :color="card.color || 'primary'" text
              >Ga naar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import firebase from 'firebase'
import ledenaantallen from '@/components/ledenaantallen'
export default {
  components: {
    ledenaantallen
  },
  data() {
    return {
      cards: [
        {
          // top || zorgt ervoor dat als card.color undefined is, dat die de waarde erachter pakt (primary) --> dus als card.color gevuld is, pakt die da, anders primary
          title: 'Iets',
          icon: 'mdi-account-group',
          src: '/financien.svg',
          page: '/leden'
        } 
        ],
        rollen: []
    }
    
  },
  computed: {
    cardsFiltered() {
      return this.cards.filter((card) => {
        if (
          this.rollen.includes(card.rol) ||
          !card.rol ||
          this.rollen.includes('groepsleider') ||
          this.rollen.includes('website')
        )
          return true
      })
    }
  },
  created() {
    firebase
      .auth()
      .currentUser.getIdTokenResult()
      .then((idTokenResult) => {
        for (const rol in idTokenResult.claims.rollen) {
          this.rollen.push(rol)
        }
      })
      .catch((error) => {
        console.log(error)
      })
}
}
</script>