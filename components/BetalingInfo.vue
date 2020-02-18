<template>
  <v-card outlined>
    <v-card-text>
      <v-expansion-panels>
        <v-expansion-panel v-for="(betaling, index) in betalingen" :key="index">
          <v-expansion-panel-header
            >{{ betaling.jaar }} -
            {{ betaling.jaar - 0 + 1 }}</v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <p>Betalingsnummer: {{ betaling.betalingsnummer }}</p>
            <p>Bedrag: {{ betaling.bedrag }}</p>
            <v-icon>{{ betaling.betaald ? `mdi-check` : `mdi-close` }}</v-icon>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script>
import { db } from '@/plugins/firebase'
export default {
  data() {
    return {
      betalingen: []
    }
  },
  props: {
    lidId: {
      type: String,
      default: ''
    }
  },
  created() {
    db.collection('leden')
      .doc(this.lidId)
      .collection('betaling')
      .get()
      .then((snap) => snap.forEach((doc) => this.betalingen.push(doc.data())))
  }
}
</script>

<style></style>
