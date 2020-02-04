<template>
  <div>
    <!-- <h1>Welkom op SmartChiro!</h1> -->

    <Inschrijven v-if="inschrijven" />
    <div v-else class="text-center">
      <img src="../assets/geenleden.svg" alt="Geen leden" class="geenleden" />
      <h1 class="headline">Hier is niets te zien</h1>
      <p>Ingeschreven leden verschijnen hier.</p>
      <v-btn
        fab
        color="primary"
        class="plusknop"
        v-if="!inschrijven"
        @click="inschrijven = !inschrijven"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import Inschrijven from '@/components/Inschrijven'
export default {
  components: {
    Inschrijven
  },
  data() {
    return {
      inschrijven: false
    }
  }
}
</script>

<style scoped>
.geenleden {
  display: block;
  margin: 0 auto;
  width: 50%;
}
.plusknop {
  position: absolute;
  bottom: 28px;
  right: 28px;
}
</style>
