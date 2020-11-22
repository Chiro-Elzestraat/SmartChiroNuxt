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
        ><v-col cols='12'> <v-text-field v-model="contactLeider.gsm" label='GSM' v-mask="mask" :rules='regexGsm' outlined width="200px"></v-text-field></v-col>
        <v-col> <v-text-field
            v-model="contactLeider.adres.straat"
            label='Straat'
            outlined
            width="200px"
          ></v-text-field></v-col>
          <v-card-actions><v-btn @click="opslaan">Update</v-btn></v-card-actions></v-card
    ></v-dialog>
  </div>
</template>

<script>
import {mask} from 'vue-the-mask'
import { db } from '@/plugins/firebase'
export default {
  directives: {
    mask
  },
  data() {
    return {
      editDialog: false,
      contactLeider: { gsm: '+32', adres: { straat: '' } },
      mask: "+## ### ## ## ##",
      regexGsm: new RegExp('^[+][0-9]{2} [0-9]{3}( [0-9]{2}){3}$'),
    }
  },
  methods: {
    opslaan() {
      const doc = db.collection('leiders/leidersdoc').doc()
      doc.set(this.contactleider)
    },
  },
}
</script>
