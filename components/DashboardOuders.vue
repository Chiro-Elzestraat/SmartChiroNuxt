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
    <v-dialog v-model="herinschrijvenDialog" v-if="leden.length > 0" width="500">
      <template v-slot:activator="{on}">
        <v-btn v-on="on" class="ma-5" color="primary">Opnieuw inschrijven</v-btn>
      </template>
      <v-card>
        <v-card-title>Opnieuw inschrijven</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item-group v-model="herinschrijven" multiple>
              <v-list-item v-for="lid in leden" :key="lid.lidId">
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
          <v-btn :loading="laden" @click="betalen" :disabled="herinschrijvenIds.length <= 0" color="primary">
            Bevestigen
          </v-btn>
          <v-btn @click="herinschrijvenDialog = false" text>Annuleren</v-btn>
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
              @click="
                () => {
                  betalenDialog = false
                  $emit('ingeschreven')
                }
              "
              dark
              text
            >Klaar
            </v-btn
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
                }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider/>
        <v-row class="pr-0 mr-0">
          <v-col>
            <v-list three-line subheader>
              <v-subheader>Informatie overschrijving</v-subheader>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Rekeningnummer</v-list-item-title>
                  <v-list-item-subtitle>BE87 7350 6146 9894</v-list-item-subtitle>
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
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col class="pr-0 mr-0 text-center hidden-xs-only">
            <p>Scan de QR-code met je bankapp om met je smartphone te betalen.</p>
            <vue-qrcode :value="betalingQr" :options="{ width: 200 }"/>
          </v-col>
        </v-row>
        <v-card-text class="text-center"
        >Gelieve deze betaling zo snel mogelijk in orde te brengen zodat wij
          uw leden correct kunnen verzekeren.
        </v-card-text
        >
      </v-card>
    </v-dialog
    >
    <v-overlay v-if="laden">
      <p>Jouw inschrijving wordt vervolledigd. Sluit deze pagina niet. Neem contact op met <a
        href="mailto:smart@chiroelzestraat.be">smart@chiroelzestraat.be</a> als dit langer dan een minuut duurt.</p>
      <v-progress-circular
        indeterminate
        size="64"
        style="margin: 0 auto; display:block;"
      ></v-progress-circular>
    </v-overlay>
    <v-dialog v-model="errorDialog" width="500">
      <v-card>
        <v-card-title>Er is iets fout gegaan</v-card-title>
        <v-card-text>Als deze fout zich blijft voordoen, stuur dan een email naar <a
          href="mailto:smart@chiroelzestraat.be">smart@chiroelzestraat.be</a> en vermeld zeker volgende fout: {{error}}
        </v-card-text>
        <v-card-actions>
          <v-btn @click="errorDialog = false" text>Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  import VueQrcode from '@chenfengyuan/vue-qrcode'
  import BewerkLidInfo from '~/components/BewerkLidInfo'
  import LidInfo from '~/components/LidInfo'

  export default {
    name: 'DashboardOuders',
    components: { BewerkLidInfo, LidInfo, VueQrcode },
    props: {
      leden: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        herinschrijven: [],
        herinschrijvenDialog: false,
        teBetalen: 0,
        betalingsId: '',
        laden: false,
        betalenDialog: false,
        errorDialog: false,
        error: ''
      }
    },
    computed: {
      herinschrijvenIds() {
        const ids = []
        this.herinschrijven.forEach(lidNummer => {
          ids.push(this.leden[lidNummer].lidId)
        })
        return ids
      },
      betalingQr() {
        return `BCD
002
2
SCT

Chirojongens Elzestraat
BE87735061469894
EUR${this.teBetalen.toFixed(2)}

${this.betalingsId}`
      }
    },
    methods: {
      betalen() {
        this.laden = true
        this.herinschrijvenDialog = false
        this.$axios.post('leden/betaling', { leden: this.herinschrijvenIds }).then(result => {
          this.teBetalen = result.data.bedrag
          this.betalingsId = result.data.betalingsnummer
          this.laden = false
          this.betalenDialog = true
        }).catch(err => {
          this.laden = false
          this.errorDialog = true
          this.error = err
        })
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
