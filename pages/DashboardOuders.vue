<template>
    <div>
      <div v-if="leden.length === 0">
        <img src="../assets/geenleden.svg" alt="Geen leden" class="geenleden"/>
        <h1 class="headline">Hier is niets te zien</h1>
        <p>Ingeschreven leden verschijnen hier.</p>
        <p>
          Waren je leden al ingeschreven in het vorige systeem?
          <a @click="$router.push('overzetten')">Klik dan hier</a> om de
          gegevens over te zetten.
        </p>
      </div>
      <div v-else>
        <v-expansion-panels>
          <v-expansion-panel v-for="(lid, index) in leden" :key="index">
            <v-expansion-panel-header>{{ lid.naam }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <BewerkLidInfo :lidProp="lid"/>
              <LidInfo :lid="lid"/>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <v-dialog width="500" v-model="herinschrijvenDialog">
        <template v-slot:activator="{on}">
          <v-btn v-on="on" class="ma-5" color="primary">Opnieuw inschrijven</v-btn>
        </template>
        <v-card>
          <v-card-title>Opnieuw inschrijven</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item-group multiple v-model="herinschrijven">
                <v-list-item v-for="lid in leden">
                  <template v-slot:default="{active}">
                    <v-list-item-action>
                      <v-checkbox :input-value="active" color="primary"></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>{{lid.naam}}</v-list-item-title>
                    </v-list-item-content>
                  </template>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" :loading="laden" @click="betalen">Bevestigen</v-btn>
            <v-btn text @click="herinschrijvenDialog = false">Annuleren</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="betalenDialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark color="primary">
            <v-toolbar-title>Betaling</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn
                dark
                text
                @click="
                () => {
                  betalenDialog = false
                  $emit('ingeschreven')
                }
              "
              >Klaar</v-btn
              >
            </v-toolbar-items>
          </v-toolbar>
          <v-list three-line subheader>
            <v-subheader>Opnieuw ingeschreven leden</v-subheader>
            <v-list-item v-for="(lid, index) in leden" :key="index" v-if="herinschrijvenIds.includes(lid.lidId)">
              <v-list-item-content>
                <v-list-item-title>{{ lid.naam }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  lid.geboortedatum
                  }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list three-line subheader>
            <v-subheader>Informatie overschrijving</v-subheader>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Rekeningnummer</v-list-item-title>
                <v-list-item-subtitle>BE97 8601 0855 9449</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Mededeling</v-list-item-title>
                <v-list-item-subtitle>{{ betalingsId }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Bedrag</v-list-item-title>
                <v-list-item-subtitle>{{
                  `€ ${teBetalen.toFixed(2)}`
                  }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-card-text class="text-center"
          >Gelieve deze betaling zo snel mogelijk in orde te brengen zodat wij
            uw leden correct kunnen verzekeren.</v-card-text
          >
        </v-card></v-dialog
      >
      <v-overlay v-if="laden">
        <p>Jouw inschrijving wordt vervolledigd. Sluit deze pagina niet. Neem contact op met <a href="mailto:smart@chiroelzestraat.be">smart@chiroelzestraat.be</a> als dit langer dan een minuut duurt.</p>
        <v-progress-circular
          indeterminate
          size="64"
          style="margin: 0 auto; display:block;"
        ></v-progress-circular>
      </v-overlay>
    </div>
</template>
<script>
  import BewerkLidInfo from '@/components/BewerkLidInfo'
  import LidInfo from '@/components/LidInfo'
  import { db } from '~/plugins/firebase'

  export default {
    name: 'DashboardOuders',
    components: { BewerkLidInfo, LidInfo },
    props: {
      leden: []
    },
    data() {
      return {
        herinschrijven: [],
        herinschrijvenDialog: false,
        teBetalen: 0,
        betalingsId: '',
        laden: false,
        betalenDialog: false,
      }
    },
    computed: {
      herinschrijvenIds() {
        const ids = []
        this.herinschrijven.forEach(lidNummer => {
          ids.push(this.leden[lidNummer].lidId)
        })
        return ids
      }
    },
    methods: {
      betalen() {
        this.laden = true
        this.herinschrijvenDialog = false
        const betaling = db.collection('startbetaling').doc()
        const batch = db.batch()
        batch.set(betaling, { leden: this.herinschrijvenIds })
        batch
          .commit()
          .then((result) => {
            this.herinschrijvenIds.forEach((lidId) => {
              db.collection('leden')
                .doc(lidId)
                .collection('betaling')
                .onSnapshot((snapshot) => {
                  if(!snapshot.metadata.fromCache)
                  snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                      this.teBetalen += change.doc.data().bedrag
                      this.betalingsId = change.doc.data().betalingsnummer
                      this.laden = false
                      this.betalenDialog = true
                      // this.$emit('ingeschreven')
                    }
                  })
                })
            })
          })
          .catch((err) => console.log(err))
      }
    }
  }
</script>
<style scoped>
    .geenleden {
        display: block;
        margin: 0 auto;
        max-width: 40%;
    }
</style>
