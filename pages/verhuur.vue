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
                 <v-text-field v-model="boeking.huurder.naam" label="Naam"/>
                 <v-text-field v-model="boeking.huurder.vereniging" label="Vereniging"/></v-col>
               <v-col cols xs="12" sm="12" md="auto"><v-date-picker v-model="boeking.dates" range></v-date-picker></v-col>
             </v-row>

              <v-textarea v-model="boeking.opmerking" label="Opmerking" />
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
      boeking: {
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
