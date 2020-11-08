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
          <v-toolbar-title>Secretaris</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
          </v-toolbar-items>
            </v-toolbar>
        <v-card flat>
          <v-card-text>
            <v-expansion-panels focusable popout>
              <v-expansion-panel v-for="(gapLid, i) in gapLeden || 0" :key="i">
                <v-expansion-panel-header :color="gapLid.gap[jaar] ? 'green': 'red'">
                  {{ gapLid.naam }}
                  <v-spacer />
                  {{
                  new Date(gapLid.geboortedatum).toLocaleDateString('nl-NL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                  })
                  }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  
                    <v-row>
                    <v-col v-for="(gapOuder, ii) in gapLid.contact.ouders"
            :key="ii"  cols="4" class="my-6">
                  <v-card           
            outlined
          >
            <v-card-title class="headline">Ouder {{ ii + 1 }}</v-card-title>
            <v-card-subtitle>{{ gapOuder.naam }}</v-card-subtitle>
            <v-card-text class="text--primary">
              <p>{{ gapOuder.gsm }}</p>
              <p>{{ gapOuder.email }}</p>
            </v-card-text>
          </v-card>
          </v-col>
          <v-col class="my-6" cols="4">
                      <v-card outlined>
                      <v-card-title>Adres</v-card-title>
                      <v-card-text>
                        {{ gapLid.adres.straat }} {{ gapLid.adres.huisnummer }}
                        {{ gapLid.adres.bus }} {{ gapLid.adres.postcode }} {{ gapLid.adres.plaats }}
                      </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col cols="12">
                      <v-checkbox
                      @click="schrijfIn(gapLid)"
                      v-model="gapLid.gap[jaar]"
                      label="Ingeschreven op GAP"></v-checkbox>
                    </v-col>
                    </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
        </v-card>
    </v-dialog>
</template>
<script>
import { db } from '../../plugins/firebase'
export default {
    data() {
        return {
            dialog: false,
            gapLeden: [],
            jaar: (new Date().getMonth() < 7 ? -1 : 0) + new Date().getFullYear()
        }
    },
    created(){
        // TODO: 2020 nog veranderen naar een berekende waarde
        let teller = 0;
        const betalingen = db.collectionGroup('betaling').where('jaar', '==', this.jaar).where('betaald', '==', true)
        betalingen.get().then(snapshot => {
         snapshot.forEach(doc => {
           doc.ref.parent.parent.get().then(doc1 => this.$set(this.gapLeden, teller++, {...doc1.data(), gap: doc1.data().gap != null ? doc1.data().gap : {[this.jaar]: false}, id: doc1.id}))
         })
        })
    },
    methods: {
      
      schrijfIn(gapLid) {
        console.log(gapLid)
        // delete gapLid.id
        const gapLid2 = {...gapLid}
        delete gapLid2.id
        console.log(gapLid2)
        db.collection('leden').doc(gapLid.id).set(gapLid2).then(() => {
          console.log("Opgeslagen")
        }).catch((err) => {
          console.log(err)
        })
      }
    },
}
</script>

<style>
.contact {
  display: flex;
  flex-wrap: wrap;
}
</style>