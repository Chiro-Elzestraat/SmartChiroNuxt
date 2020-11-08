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
            <v-btn
              @click="dialog = false"
              dark
              text
            >
              Save
            </v-btn>
          </v-toolbar-items>
            </v-toolbar>
        <v-card flat>
          <v-card-text>
            <v-expansion-panels focusable popout>
              <v-expansion-panel v-for="(gapLid, i) in gapLeden || 0" :key="i">
                <v-expansion-panel-header>
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
                  <v-card>
                  <v-card
            v-for="(gapOuder, i) in gapLid.contact.ouders"
            :key="i"
            outlined
            class="contactpersoon"
          >
            <v-card-title class="headline">Ouder {{ i + 1 }}</v-card-title>
            <v-card-subtitle>{{ gapOuder.naam }}</v-card-subtitle>
            <v-card-text class="text--primary">
              <p>{{ gapOuder.gsm }}</p>
              <p>{{ gapOuder.email }}</p>
            </v-card-text>
          </v-card>
                    <div v-if="gapLid.adres">
                      <v-card-title>
                        <h5>adres</h5>
                      </v-card-title>
                      <v-card-text>
                        {{ gapLid.adres.straat }} {{ gapLid.adres.huisnummer }}
                        {{ gapLid.adres.bus }} {{ gapLid.adres.postcode }} {{ gapLid.adres.plaats }}
                      </v-card-text>
                    </div>
                  </v-card>
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
        const betalingen = db.collectionGroup('betaling').where('jaar', '==', this.jaar).where('betaald', '==', true)
        betalingen.get().then(snapshot => {
         snapshot.forEach(doc => {
           doc.ref.parent.parent.get().then(doc1 => this.gapLeden.push({...doc1.data()}))
         })
        })
    },
    methods: {
      name() {
        
      }
    },
}
</script>

<style>
.contactpersoon {
  margin: 16px auto;
  min-width: 200px;
}
.contact {
  display: flex;
  flex-wrap: wrap;
}
</style>