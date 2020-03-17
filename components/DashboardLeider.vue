<template>
  <div>
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
export default {
  data() {
    return {
      cards: [
        {
          // top || zorgt ervoor dat als card.color undefined is, dat die de waarde erachter pakt (primary) --> dus als card.color gevuld is, pakt die da, anders primary
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
        },
        {
          title: 'Quarantainespel',
          src: '/virus.svg',
          page: '/quarantainespel',
          color: '#64DD17'
        }
      ],
      rollen: []
    }
  },
  computed: {
    cardsFiltered() {
      return this.cards.filter((card) => {
        if (this.rollen.includes(card.rol) || !card.rol) return true
      })
    }
  },
  created() {
    firebase
      .auth()
      .currentUser.getIdTokenResult()
      .then((idTokenResult) => {
        if (idTokenResult.claims.kas) {
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
