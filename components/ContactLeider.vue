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
        ><v-col cols='12'> <v-text-field v-model="contactLeider.gsm" label='GSM' v-mask="mask" :rules='regelGsm' outlined width="200px"></v-text-field></v-col>
 <!--       <v-col> <v-text-field
            v-model="contactLeider.adres.straat"
            label='Straat'
            outlined
            width="200px"
          ></v-text-field></v-col>-->
          <v-card-actions><v-btn :disabled="!regexGsm.test(contactLeider.gsm)" @click="opslaan">Update</v-btn></v-card-actions></v-card
    ></v-dialog>
    <v-snackbar v-model='bevestiging'>Gegevens geüpdatet</v-snackbar>
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
      contactLeider: {},
      mask: "+## ### ## ## ##",
      regexGsm: new RegExp('^[+][0-9]{2} [0-9]{3}( [0-9]{2}){3}$'),
      bevestiging: false,
      regelGsm: [
          (value) =>
            this.regexGsm.test(value) ||
            value === '+32' ||
            'Ongeldig gsm-nummer. Verwacht formaat: +32 123 45 67 89'
        ]
    }
  },
  mounted () {
    this.opvragen()
  },
  methods: {
    opvragen() {
      db.collection('gebruikers')
      .doc(this.$store.state.gebruiker.user.data.uid)
      .get()  // $store staat voor de vuex (kijk in browser na waar id staat bij vuex)
      .then(doc => {       
        this.contactLeider = doc.data() //  { gsm: '+32', adres: { straat: '' } } => contactLeider.gsm is dus ook doc.data().gsm (test eens met console.log in browser)
      }) // doc is een var die benoemt wat ge krijgt van .get(), pijl betekent functie, gebruik {} voor meerdere lijntjes
    },
    opslaan() {
      db.collection('gebruikers')
      .doc(this.$store.state.gebruiker.user.data.uid)
      .set(this.contactLeider)  // Welke data ge wilt meegeven met .set()
      .then(() => {               // '()' gebruiken omdat er geen 'doc' fzo moet meegegeven worden
        this.bevestiging = true
        this.editDialog = false
      })

    },
  },
}
</script>
