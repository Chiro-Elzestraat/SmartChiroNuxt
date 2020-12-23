<template>
<div>
  <v-row>
    <!-- <v-col cols="4">
      <Ledenaantallen />
    </v-col> -->
  </v-row>
    <v-row>
      <v-col><Secretaris v-if="isSecretaris" />
      <div v-else>Het is hier voorlopig nog leeg.</div>
      </v-col>
      <!-- <v-col v-for="(card, index) in cardsFiltered" :key="index">
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
      </v-col> -->
    </v-row>
  </div>
</template>

<script>
// import firebase from 'firebase'
import Secretaris from '@/components/OnzeChiro/Secretaris'
// import Ledenaantallen from '@/components/onzeChiro/Ledenaantallen'
export default {
  components: {
    // Ledenaantallen,
    Secretaris
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
    },
    isSecretaris() {
      return this.$store.state.gebruiker.user.secretaris ?? false
    }
  },
  created() {
    // firebase
    //   .auth()
    //   .currentUser.getIdTokenResult()
    //   .then((idTokenResult) => {
    //     for (const rol in idTokenResult.claims.rollen) {
    //       this.rollen.push(rol)
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //   })
}
}
</script>
