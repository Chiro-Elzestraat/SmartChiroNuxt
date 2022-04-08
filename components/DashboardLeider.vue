<template>
  <div style='display: flex; flex-direction: column; align-items: center'>
    <div class='rekeningnummer-wrap'>Rekeningnummer Chiro: <span @click="kopierRekeningnummer" class='rekeningnummer'>BE87 7350 6146 9894</span></div>
    <v-snackbar v-model="gekopieerd">
      Rekeningnummer gekopieerd
    </v-snackbar>
    <div class='dashboard-grid'>
        <div
          v-for="(card, index) in cardsFiltered" :key="index"
          @click="go(card)"
          :class='card.disabled ? "disabled": "enabled"'
          class='dashboard-card'
        >
          <img :src="card.src" style='width: 100%; object-fit: contain; height: 200px'>
          <span v-text="card.title" class='card-title'></span>
        </div>
    </div>
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
      navigator.clipboard.writeText("BE87 7350 6146 9894").then(() => {
        this.gekopieerd = true
      })
    }
  }
}
</script>

<style>
.dashboard-grid{
  padding: 16px;
  width: 100%;
  grid-gap: 4em;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
@media (min-width: 500px){
  .dashboard-grid{
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }
}
.dashboard-card{
  display: flex;
  flex-direction: column;
  text-align: center;
}
.dashboard-card.disabled{
  opacity: 0.5;
}
.dashboard-card.enabled{
  transition: 0.5s;
  cursor: pointer;
  border-radius: 15px;
}
.dashboard-card.enabled:hover, .dashboard-card.enabled:focus{
  transform: scale(1.05);
  background: rgba(255, 255, 255, 0.2);
}
.card-title{
  margin-top: 1em;
  font-size: 1.5rem;
  align-self: center;
  font-weight: bold;
}
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
