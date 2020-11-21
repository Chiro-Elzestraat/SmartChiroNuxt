<template>
  <div>
    <v-card
      ><v-card-title>Persoonlijke info</v-card-title
      ><v-card-subtitle
        >Stel hier je persoonlijke contactgegevens in om bereikbaar te zijn voor
        medeleiders</v-card-subtitle
      >
      <v-card-actions
        ><v-btn color='primary' @click="editDialog = true"
          >Update gegevens</v-btn
        ></v-card-actions
      ></v-card
    >
    <v-dialog v-model="editDialog" width="800px"
      ><v-card
        ><v-col cols='12'> <v-text-field v-model="contactLeider.gsm" label='GSM' outlined width="200px"></v-text-field></v-col>
        <v-col> <v-text-field
            v-model="contactLeider.adres.straat"
            label='Straat'
            outlined
            width="200px"
          ></v-text-field></v-col>
          <v-card-actions><v-btn@click="opslaan()">Update</v-btn></v-card-actions></v-card
    ></v-dialog>
  </div>
</template>

<script>
import { db } from '@/plugins/firebase'
export default {
  data() {
    return {
      editDialog: false,
      contactLeider: {gsm: '', adres: {straat: ''}}
    }
  },
  methods: {
      opslaan() {
        const doc = db.collection('leiders/leidersdoc').doc()
        doc.set(this.contactleider)
      }
  }
}
</script>
