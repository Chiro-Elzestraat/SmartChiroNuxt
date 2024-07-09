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
        <v-card v-for="(betaling) in betalingen" :key="betaling.betalingsnummer" class="ma-6"> 
          <v-list-item v-if="betaling.jaar">
            <v-list-item-content>
              <v-list-item-title>Chirojaar: {{betaling.jaar}} - {{betaling.jaar + 1}}</v-list-item-title>
              <v-list-item-subtitle>Betaling €{{betaling.bedrag}} {{betaling.betaald ? "in orde" : "nog niet ontvangen"}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-card v-if="betaling.bbq">
            <v-card-title>BBQ</v-card-title>
            <v-card-text>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Volwassenporties</v-list-item-title>
                  <v-list-item-subtitle>{{betaling.bbq.volwassenPorties}} porties</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Kinderporties</v-list-item-title>
                  <v-list-item-subtitle>{{betaling.bbq.kinderPorties}} porties</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card-text>
          </v-card>
          <v-card v-if="betaling.lid">
            <v-card-title>{{ betaling.lid.naam }}</v-card-title>
            <v-card-text>
              <v-list-item v-for="ouder in betaling.lid.contact.ouders">
                <v-list-item-content>
                  <v-list-item-title>{{ouder.naam}}</v-list-item-title>
                  <v-list-item-subtitle><a :href="`mailto:${ouder.email}`">{{ouder.email}}</a></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card-text>
          </v-card>
          <v-card v-if="betaling.leden">
            <v-card-title>Leden</v-card-title>
            <v-card-text>
              <v-list-item v-for="(lid, index) in betaling.leden" :key="index">
                <v-list-item-content>
                  <v-list-item-title>{{lid.naam}}</v-list-item-title>
                  <v-list-item-subtitle>{{lid.lidId}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card-text>
          </v-card>
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
        </v-card>
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
            if (doc.data().bedrag <= saldo && !doc.data().betaald) {
              saldo -= doc.data().bedrag
              await doc.ref
                .update({ betaald: true })
                .then()
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
            const data = doc.data()
            if(data.jaar){
              doc.ref.parent.parent.get().then((lidDoc) => {
                this.betalingen.push({...doc.data(), lid: lidDoc.data()})
              })
            } else {
              this.betalingen.push(doc.data())
            }
            
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
