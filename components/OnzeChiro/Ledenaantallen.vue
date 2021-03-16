<template>
    <v-dialog v-model="aanpassen" fullscreen>
        <template v-slot:activator="{ on }">
            <v-card @click="aanpassen=true" class="mx-auto"
          max-width="400" ><div class='pt-md-4'><v-img src="/secretaris_myfiles.svg" height="200px" width="400px" contain></v-img></div><v-card-title>Ledenaantallen</v-card-title><v-card-subtitle>Voer hier wekelijks de ledenaantallen in</v-card-subtitle><v-card-actions class="justify-center">
        <v-btn v-on="on" outlined color='primary' text>Ga naar</v-btn></v-card-actions></v-card>
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
          <v-card><v-card-title>Geselecteerde zondag: {{afgelopenZondag}}</v-card-title></v-card>
          <div v-for="(groep, index) in groepen" :key="index">
              <v-row>
                <v-card-subtitle>{{ groep.naam }}</v-card-subtitle>
                <v-btn
                  text
                  :disabled="groep.aantal <= 0"
                  @click="groep.aantal--"
                >
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                <v-text-field
                  v-model="groep.aantal"
                  v-mask="'##'"
                  class="shrink"
                ></v-text-field>
                <v-btn
                  text
                  :disabled="groep.aantal >= 99"
                  @click="groep.aantal++"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-row>
          </div>
        </v-card>
      </v-dialog>
</template>

<script>
// import firebase from 'firebase'
import { mask } from 'vue-the-mask'
import { db } from '@/plugins/firebase'
export default {
  directives: { mask },
  data() {
    return {
      afgelopenZondag:"",
      datums: [],
      aanpassen: false,
      groepen: [{naam:'speelclub', aantal: 0},{naam: 'rakkers', aantal: 0},{naam:'toppers', aantal: 0},{naam:'kerels', aantal:0}, {naam:'aspiranten', aantal:0}]
    }
  },
  mounted() {
    this.opvragen()
    this.huidigeDatumBerekenen()
  },
  methods: { 
    opvragen() {
      db.collection('ledenaantallen')
        .get()
        .then((snap) => {
          snap.forEach((doc) => {
            this.datums.push(doc.data())
          })
        })
        console.log(this.datums)
    },
    // opslaan() {
    //   db.collection('ledenaantallen')
    //   .doc()
    //   .set(this.contactLeider)  // Welke data ge wilt meegeven met .set()
    //   .then(() => {               // '()' gebruiken omdat er geen 'doc' fzo moet meegegeven worden
    //     this.bevestiging = true
    //     this.editDialog = false
    //   })

    // },
    huidigeDatumBerekenen() {
      const Dag = new Date().getDay()
      const VandaagTijd = new Date().getTime() - Dag*86400000
      this.afgelopenZondag = new Date(VandaagTijd)
    },
    maakDocNaam() {
      const str1 = this.afgelopenZondag.getDate()
      const str2 = this.afgelopenZondag.getMonth()
      const str3 = this.afgelopenZondag.getFullYear()
      const docNaam = str1.concat(str2,str3)
      return  docNaam
    }
  },
  computed: {
    
  }
}
</script>