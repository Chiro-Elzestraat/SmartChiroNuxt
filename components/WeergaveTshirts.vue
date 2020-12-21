<template>
  <div>
    <h1>Bestelde T-shirts</h1>
    <v-card>
      <v-card-title>Aantal bestellingen: {{alleBestellingen.length}}</v-card-title>
      <v-card-subtitle>Aantal tshirts: {{aantalTshirts}}</v-card-subtitle>
      <v-btn @click="krijgMails" :disabled="alleBestellingen.length <= 0">Krijg emails</v-btn>
      <v-list>
        <v-list-item v-for="(bestelling) in alleBestellingen" :key="bestelling.betalingsnummer">
          <v-list-item-content v-for="(shirt, index) in bestelling.tshirts" :key="index"
          >
            <v-list-item-title>{{shirt.naam}}
            </v-list-item-title>
            <v-list-item-subtitle> {{maatToString(shirt.maat)
              }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-icon>
            <v-tooltip left>
              <template v-slot:activator="{ on }">   <!--betaling hieronder nog fixen -->
                <v-icon
                  v-on="on"
                  @click="kopieerNummer(bestelling.betalingsnummer)"
                >
                  {{ bestelling.betaald ? 'mdi-check' : 'mdi-close' }}
                </v-icon>
              </template>
              <span>{{ bestelling.betalingsnummer }}</span>
            </v-tooltip>
          </v-list-item-icon>
        </v-list-item>
      </v-list>

    </v-card>
    <v-snackbar v-model="gekopieerd">
      Betalingsnummer gekopieerd
    </v-snackbar><v-snackbar v-model="mailsGekopieerd">
    Mails gekopieerd
  </v-snackbar>
  </div>
</template>
<script>
  import { db } from '@/plugins/firebase'

  export default {
    data() {
      return {
        alleBestellingen: [],
        gekopieerd: false,
        mailsGekopieerd: false,
        alleMails: '',
        maten: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'kindermaat 2 jaar', 'kindermaat 4 jaar', 'kindermaat 6 jaar', 'kindermaat 8 jaar', 'kindermaat 10 jaar', 'kindermaat 12 jaar'],
        aantalTshirts: 0
      }
    },
    mounted() {
      this.laadbestellingen()
    },
    methods: {
      laadbestellingen() {
        db.collection('shop')
          .doc('tshirt')
          .collection('betaling')
          .get()
          .then((snap) => {
            snap.forEach((doc) => {
              this.alleBestellingen.push(doc.data())
              this.aantalTshirts += doc.data().tshirts.length
            })

          })
      },
      maatToString(maat) {
        return this.maten[maat]
      },
      kopieerNummer(betalingsnummer) {
        navigator.clipboard.writeText(betalingsnummer).then(() => {
          this.gekopieerd = true
        })
      },
      krijgMails() {
        this.alleMails = ''
        this.alleBestellingen.forEach((bestelling) => {
          if (bestelling.email.includes('@'))
            this.alleMails += bestelling.email + ';'
        })
        navigator.clipboard.writeText(this.alleMails).then(() => {
          this.mailsGekopieerd = true
        })

      }
    }
  }

</script>
