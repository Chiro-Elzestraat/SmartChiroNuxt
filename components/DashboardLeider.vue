<template>
  <div style='display: flex; flex-direction: column; align-items: center'>
    <div class='rekeningnummer-wrap'>Rekeningnummer Chiro: <span @click="kopierRekeningnummer" class='rekeningnummer'>BE97 8601 0855 9449</span></div>
    <v-snackbar v-model="gekopieerd">
      Rekeningnummer gekopieerd
    </v-snackbar>
    <v-row>
      <v-col v-for="(card, index) in cardsFiltered" :key="index">
        <v-card
          :disabled="card.disabled"
          @click="go(card)"
          class="mx-auto"
          max-width="400"
        >
          <v-img :src="card.src" height="200px" width="400px" contain></v-img>
          <v-card-title v-text="card.title"></v-card-title>
          <v-card-actions class="justify-center">
            <v-btn :color="card.color || 'primary'" outlined text
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
      gekopieerd: false,
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
          title: 'Uitstappen',
          icon: 'mdi-dashboard',
          src: '/uitstap.svg',
          page: '/uitstap'
        },
        {
          title: 'T-shirts',
          icon: 'mdi-dashboard',
          src: '/tshirt.svg',
          page: '/bestellingTshirts'
        },
        {
          title: 'Verhuur',
          icon: 'mid-account_box',
          src: '/verhuur.svg',
          page: 'https://verhuur.chiroelzestraat.be/',
          link: true,
          disabled: false
        },
        {
          title: 'Evenementen (in ontwikkeling)',
          icon: 'mid-gavel',
          src: '/evenementen.svg',
          page: '/events',
          disabled: true
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
        console.warn(error)
      })
  },
  methods: {
    go(card) {
      if(card.link)
        window.location = card.page
      else
      this.$router.push(card.page)
    },
    kopierRekeningnummer(){
      navigator.clipboard.writeText("BE97 8601 0855 9449").then(() => {
        this.gekopieerd = true
      })
    }
  }
}
</script>

<style>
.rekeningnummer-wrap{
  background: white;
  display: block;
  color: #8bc34a;
  border-radius: 15px;
  padding: 10px;
  margin-bottom: 16px;
  font-weight: bold;
}
.rekeningnummer{
  cursor: pointer;
}
.rekeningnummer:focus, .rekeningnummer:hover{
  text-decoration: underline;
  color: black;
}
</style>
