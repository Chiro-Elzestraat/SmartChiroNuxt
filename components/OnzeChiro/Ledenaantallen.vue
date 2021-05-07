<template>
  <div>
    <v-card>
      <v-card-title>Ledenaantallen</v-card-title
      ><v-dialog v-model="aanpassen" fullscreen hide-overlay>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" fab color="primary" bottom right absolute>
            <!-- ah das idd echt op die kaart, nice -->
            <v-icon>mdi-pencil</v-icon>
            <!-- oke ff teruggegaan want teveel kopiëren is niet goed, dan verliest ge overzicht en weet ge ni waarom da ni werkt -->
          </v-btn>
        </template>
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn @click="aanpassen = false" icon dark>
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Ledenaantallen aanpassen</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn @click="opslaan" text>Opslaan</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-actions>
            <v-container>
            <v-col v-for="(groep, index) in groepen" :key="index" cols="6">
              <v-row>
                <v-card-subtitle>{{ groep.naam }}</v-card-subtitle>
                <v-btn
                  :disabled="groep.aantal <= 0"
                  @click="groep.aantal--"
                  text
                >
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                <v-text-field
                  v-model="groep.aantal"
                  v-mask="'##'"
                  width="40"
                ></v-text-field>
                <v-btn
                  :disabled="groep.aantal >= 99"
                  @click="groep.aantal++"
                  text
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn></v-row
              ></v-col
            >
            </v-container>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
// import firebase from 'firebase'
import { mask } from 'vue-the-mask'
export default {
  directives: { mask },
  data() {
    return {
      aanpassen: false,
      groepen: [{naam:'speelclub', aantal: 0},{naam: 'rakkers', aantal: 0},{naam:'toppers', aantal: 0},{naam:'kerels', aantal:0}, {naam:'aspiranten', aantal:0}]
    }
  }
}
</script>