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
