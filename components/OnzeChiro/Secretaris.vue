<template>
    <v-dialog v-model="dialog" fullscreen>
        <template v-slot:activator="{ on }">
            <v-card><v-img src="/static/secretaris_myfiles.svg" height="200px" width="400px" contain></v-img><v-card-title>Secretaris</v-card-title><v-card-subtitle>Inschrijven leden GAP</v-card-subtitle><v-card-actions>
        <v-btn v-on="on">Secretaris</v-btn></v-card-actions></v-card>
        </template>
        <v-card>
            <v-toolbar>
                <v-btn
            @click="dialog = false"
            icon
            dark
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Settings</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              @click="dialog = false"
              dark
              text
            >
              Save
            </v-btn>
          </v-toolbar-items>
            </v-toolbar>
        </v-card>
    </v-dialog>
</template>
<script>
import { db } from '../../plugins/firebase'
export default {
    data() {
        return {
            dialog: false,
            leden: []
        }
    },
    created(){
        // TODO: 2020 nog veranderen naar een berekende waarde
        db.collectionGroup('betaling').where('jaar', '==', '2020')
    }
}
</script>