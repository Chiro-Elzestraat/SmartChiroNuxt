<template>
  <div>
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
            v-model="bedrag"
            label="Bedrag"
          ></v-text-field>
          <v-btn
            :loading="laden"
            :disabled="betaald"
            :color="bedrag == totaalPrijs ? 'green' : 'red'"
            type="submit"
            class="bevestigknop"
            >Bevestig</v-btn
          >
          <p v-if="transactieId != '' && betaald" class="text-center">
            Al betaald
          </p>
        </form>
      </v-card-text>
    </v-card>
  </div>
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
      betaald: true
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
            console.log(doc.data())
          })
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
