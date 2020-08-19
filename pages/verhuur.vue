<template>
    <v-container>
        <h1>Verhuur</h1>
        <v-dialog v-model="nieuweBoekingDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
          <template v-slot:activator="{on}">
            <v-btn v-on="on" fab fixed bottom right color="primary"><v-icon>mdi-plus</v-icon></v-btn>
          </template>
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn @click="nieuweBoekingDialog = false" icon dark><v-icon>mdi-close</v-icon></v-btn>
              <v-spacer/>
              <v-btn @click="voegVerhuurToe" text>Toevoegen</v-btn>
            </v-toolbar>
            <v-container>
             <v-row>
               <v-col cols xs="12" sm="12" md="8">
                 <v-text-field v-model="boeking.huurder.vereniging" label="Vereniging"/>
                 <v-text-field v-model="boeking.huurder.naam" label="Naam"/>
                 <v-text-field v-model="boeking.huurder.email" label="Email"/>
                 <v-text-field v-model="boeking.huurder.gsm" label="GSM"/>
                 <v-row>
                   <v-col cols="auto">
                     <v-checkbox v-model="boeking.huurder.contractInorde" label="Contract in orde"></v-checkbox>
                   </v-col>
                   <v-col cols="auto">
                     <v-checkbox v-model="boeking.huurder.waarborgInorde" label="Waarborg in orde"></v-checkbox>
                   </v-col>
                 </v-row>
               </v-col>
               <v-col cols xs="12" sm="12" md="auto"><v-date-picker v-model="boeking.dates" range></v-date-picker></v-col>
             </v-row>
              <v-textarea v-model="boeking.opmerking" label="Opmerking" />
              <v-menu
                v-model="datumInput"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="boeking.datumAanvraag"
                    v-bind="attrs"
                    v-on="on"
                    label="Datum van aanvraag"
                    prepend-icon="mdi-calendar"
                    readonly
                  ></v-text-field>
                </template>
                <v-date-picker v-model="boeking.datumAanvraag" @input="datumInput = false"></v-date-picker>
              </v-menu>
            </v-container>
          </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
  import { db } from '@/plugins/firebase'
export default {
  data() {
    return {
      nieuweBoekingDialog: false,
      datumInput: false,
      boeking: {
        datumAanvraag: '',
        dates: [],
        huurder: {
          contractInOrde: false,
          waarborgInOrde: false,
          gsm: '',
          naam: '',
          vereniging: '',
        },
        opmerking: '',
      },
    }
  },
  methods: {
    voegVerhuurToe() {
      db.collection('verhuur').add({datumAanvraag: new Date(this.boeking.datumAanvraag), beginDatum: new Date(this.beginDatum), eindDatum: new Date(this.eindDatum)}).then(ref => {
        ref.collection('huurder').doc('info').set({...this.boeking.huurder, opmerking: this.boeking.opmerking}).then(() => {
          this.nieuweBoekingDialog = false
        })
      })
    }
  },
  created() {
    // db.collection('verhuur').where()
  },
  computed: {
    beginDatum() {
      if(this.gesorteerdeDatums.length > 0)
        return this.gesorteerdeDatums[0]
      return 0
    },
    eindDatum(){
      if(this.gesorteerdeDatums.length > 1)
        return this.gesorteerdeDatums[1]
      return 0
    },
    gesorteerdeDatums(){
      const dates = this.boeking.dates
      return dates.sort((a, b) => new Date(a).getTime()-new Date(b).getTime())
    }
  }
}
</script>
