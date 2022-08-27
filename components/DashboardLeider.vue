<template>
  <div style='display: flex; flex-direction: column; align-items: center'>
    <div class='rekeningnummer-wrap'>Rekeningnummer Chiro: <span @click="kopierRekeningnummer"
        class='rekeningnummer'>BE87 7350 6146 9894</span>
      <v-btn icon @click="qrBetaling = true">
        <v-icon color="black">mdi-qrcode-plus</v-icon>
      </v-btn>
    </div>
    <div class="rekeningnummer-wrap">
      Rekeningnummer Drank: <span @click="kopierRekeningnummerDrank" class='rekeningnummer'>BE41 7350 6147 1110
        <v-icon color="black">mdi-glass-mug-variant</v-icon>
      </span>
    </div>
    <v-snackbar v-model="gekopieerd">
      Rekeningnummer gekopieerd
    </v-snackbar>
    <div class='dashboard-grid'>
      <div v-for="(card, index) in cardsFiltered" :key="index" @click="go(card)"
        :class='card.disabled ? "disabled" : "enabled"' class='dashboard-card'>
        <img :src="card.src" style='width: 100%; object-fit: contain; height: 200px'>
        <span v-text="card.title" class='card-title'></span>
      </div>
    </div>
    <v-dialog v-model="qrBetaling" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Betaling</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn @click="
              () => {
                qrBetaling = false
              }
            " dark text>Klaar
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-divider />
        <v-row class="pr-0 mr-0">
          <v-col cols="12" md="6">
            <v-list three-line subheader>
              <v-subheader>Informatie overschrijving</v-subheader>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Rekeningnummer</v-list-item-title>
                  <v-list-item-subtitle>BE87 7350 6146 9894</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-text-field label="Mededeling" v-model="mededeling"></v-text-field>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-text-field v-model="teBetalen" label="Bedrag" prefix="€"></v-text-field>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col class="pt-12 text-center">
            <vue-qrcode class="mb-4" :value="betalingQr" :options="{ width: 200 }" />
            <p>Scan de QR-code met je bankapp (niet Payconiq) om met je smartphone te betalen.</p>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import firebase from 'firebase'
import VueQrcode from '@chenfengyuan/vue-qrcode'
export default {
  components: {
    VueQrcode
  },
  data() {
    return {
      mededeling: '',
      teBetalen: '0',
      qrBetaling: false,
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
    },
    betalingQr() {
      return `BCD
002
2
SCT

Chirojongens Elzestraat
BE87735061469894
EUR${(parseFloat(this.teBetalen)).toFixed(2)}

${this.mededeling}`
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
      if (card.link)
        window.location = card.page
      else
        this.$router.push(card.page)
    },
    kopierRekeningnummer() {
      navigator.clipboard.writeText("BE87 7350 6146 9894").then(() => {
        this.gekopieerd = true
      })
    },
    kopierRekeningnummerDrank() {
      navigator.clipboard.writeText("BE41 7350 6147 1110").then(() => {
        this.gekopieerd = true
      })
    }
  }
}
</script>

<style>
.dashboard-grid {
  padding: 16px;
  width: 100%;
  grid-gap: 4em;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

@media (min-width: 500px) {
  .dashboard-grid {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }
}

.dashboard-card {
  display: flex;
  flex-direction: column;
  text-align: center;
}

.dashboard-card.disabled {
  opacity: 0.5;
}

.dashboard-card.enabled {
  transition: 0.5s;
  cursor: pointer;
  border-radius: 15px;
}

.dashboard-card.enabled:hover,
.dashboard-card.enabled:focus {
  transform: scale(1.05);
  background: rgba(255, 255, 255, 0.2);
}

.card-title {
  margin-top: 1em;
  font-size: 1.5rem;
  align-self: center;
  font-weight: bold;
}

.rekeningnummer-wrap {
  background: white;
  display: block;
  color: #8bc34a;
  border-radius: 15px;
  padding: 10px;
  margin-bottom: 16px;
  font-weight: bold;
}

.rekeningnummer {
  cursor: pointer;
}

.rekeningnummer:focus,
.rekeningnummer:hover {
  text-decoration: underline;
  color: black;
}
</style>
