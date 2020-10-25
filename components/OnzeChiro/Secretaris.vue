<template>
    <v-dialog v-model="dialog" fullscreen>
        <template v-slot:activator="{ on }">
            <v-card @click="dialog=true" class="mx-auto"
          max-width="400" ><div class='pt-md-4'><v-img src="/secretaris_myfiles.svg" height="200px" width="400px" contain></v-img></div><v-card-title>Secretaris</v-card-title><v-card-subtitle>Inschrijven leden GAP</v-card-subtitle><v-card-actions class="justify-center">
        <v-btn v-on="on" outlined color='primary' text>Ga naar</v-btn></v-card-actions></v-card>
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
        const betalingen = db.collectionGroup('betaling').where('jaar', '==', '2021')
        betalingen.get().then(snapshot => {
            snapshot.forEach(doc => {
                console.log(doc.ref.parent.get())
            })
        })
    }
}
</script>