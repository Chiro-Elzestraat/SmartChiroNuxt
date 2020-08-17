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
            </v-toolbar>
            <v-container>
             <v-row>
               <v-col cols xs="12" sm="12" md="8"><v-text-field v-model="boeking.huurder.gsm" label="GSM"/>
                 <v-text-field v-model="boeking.huurder.email" label="Email"/>
                 <v-text-field v-model="boeking.huurder.naam" label="Naam"/>
                 <v-text-field v-model="boeking.huurder.vereniging" label="Vereniging"/>
                 <v-row>
                   <v-col cols="auto">
                     <v-checkbox v-model="boeking.contractInorde" label="Contract in orde"></v-checkbox>
                   </v-col>
                   <v-col cols="auto">
                     <v-checkbox v-model="boeking.waarborgInorde" label="Waarborg in orde"></v-checkbox>
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
export default {
  data() {
    return {
      nieuweBoekingDialog: false,
      datumInput: false,
      boeking: {
        datumAanvraag: '',
        dates: [],
        huurder: {
          gsm: '',
          naam: '',
          vereniging: '',
        },
        opmerking: '',
      },
    }
  }
}
</script>
