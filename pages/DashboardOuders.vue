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
            <v-btn color="primary">Bevestigen</v-btn>
            <v-btn text @click="herinschrijvenDialog = false">Annuleren</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
</template>
<script>
  import BewerkLidInfo from '@/components/BewerkLidInfo'
  import LidInfo from '@/components/LidInfo'

  export default {
    name: 'DashboardOuders',
    components: { BewerkLidInfo, LidInfo },
    props: {
      leden: {}
    },
    data() {
      return {
        herinschrijven: {},
        herinschrijvenDialog: false,
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
