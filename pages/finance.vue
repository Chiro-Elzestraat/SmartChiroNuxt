<template>
  <v-container>
    <h1>Financiën</h1>
    <v-card>
      <v-card-title>Betalingsverwerking</v-card-title>
      <v-card-text>
        <form @submit="submit">
          <v-text-field
            v-model="transactieId"
            @input="search"
            label="Transactie-ID"
            hint="Eerste twee cijfers geven de categorie aan."
          ></v-text-field>
          <v-text-field
            :hint="`Verwacht bedrag: ${totaalPrijs}`"
            :persistent-hint="totaalPrijs > 0"
            v-model="bedrag"
            label="Bedrag"
          ></v-text-field>
          <v-btn
            :loading="laden"
            :disabled="betaald || bestaatNiet"
            :color="bedrag == totaalPrijs ? 'green' : 'red'"
            type="submit"
            class="bevestigknop"
            >Bevestig</v-btn
          >
          <p v-if="bestaatNiet" class="text-center">
            Transactie ID bestaat niet.
          </p>
          <p v-else-if="transactieId != '' && betaald" class="text-center">
            Al betaald
          </p>
        </form>
        <div v-for="(betaling) in betalingen" :key="betaling.betalingsnummer">
          <v-list-item v-if="betaling.jaar">
            <v-list-item-content>
              <v-list-item-title>Chirojaar: {{betaling.jaar}} - {{betaling.jaar + 1}}</v-list-item-title>
              <v-list-item-subtitle>Betaling €{{betaling.bedrag}} {{betaling.betaald ? "in orde" : "nog niet ontvangen"}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-card v-if="betaling.email && betaling.tshirts">
            <v-card-title><v-icon>mdi-email</v-icon>&nbsp;<a :href="`mailto:${betaling.email}`">{{betaling.email}}</a></v-card-title>
            <v-card-subtitle>Bestelling T-shirts</v-card-subtitle>
            <v-card-text>
              <v-list-item v-for="(tshirt, index) in betaling.tshirts" :key="index">
                <v-list-item-content>
                  <v-list-item-title>Naam: {{tshirt.naam}}</v-list-item-title>
                  <v-list-item-subtitle>Maat: {{maten[tshirt.maat]}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card-text>
          </v-card>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { db, auth } from '@/plugins/firebase'

export default {
  data() {
    return {
      transactieId: '',
      totaalPrijs: 0,
      bedrag: '',
      laden: false,
      betaald: true,
      bestaatNiet: false,
      betalingen: [],
      maten: ["XS", "S", "M", "L", "XL", "XXL", "Kindermaat 2 jaar", "Kindermaat 4 jaar", "Kindermaat 6 jaar", "Kindermaat 8 jaar", "Kindermaat 10 jaar", "Kindermaat 12 jaar"]
    }
  },
  methods: {
    submit() {
      let saldo = this.bedrag
      this.laden = true
      db.collectionGroup('betaling')
        .where('betalingsnummer', '==', this.transactieId)
        .get()
        .then((snap) => {
          snap.forEach(async (doc) => {
            console.log(doc.data())
            if (doc.data().bedrag <= saldo && !doc.data().betaald) {
              saldo -= doc.data().bedrag
              await doc.ref
                .update({ betaald: true })
                .then(() => console.log('betaling geslaagd'))
                .catch((err) =>
                  console.error('Fout bij verwerken betaling: ', err)
                )
            }
          })
          this.laden = false
          this.bedrag = ''
          this.transactieId = ''
        })
      event.preventDefault()
      auth.currentUser.getIdTokenResult().then((idTokenResult) => {
        console.log(idTokenResult)
      })
    },
    search() {
      this.betalingen = []
      db.collectionGroup('betaling')
        .where('betalingsnummer', '==', this.transactieId)
        .get()
        .then((snap) => {
          this.totaalPrijs = 0
          snap.forEach((doc) => {
            if (!doc.data().betaald) {
              this.totaalPrijs += doc.data().bedrag
              this.betaald = false
            }
            this.betalingen.push(doc.data())
            console.log(doc.data())
          })
          this.bestaatNiet = snap.docs.length === 0
        })
    }
  },
  head() {
    return {
      title: 'Finance'
    }
  }
}
</script>

<style>
.bevestigknop {
  margin: 0 auto;
  display: block;
}
</style>
