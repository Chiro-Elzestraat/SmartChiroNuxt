<template>
  <div>
    <!-- <h1>Welkom op SmartChiro!</h1> -->

    <Inschrijven
      v-if="inschrijven && this.$store.state.gebruiker.user.ouder"
      v-on:ingeschreven="inschrijven = !inschrijven"
    />
    <div
      v-else-if="!inschrijven && this.$store.state.gebruiker.user.ouder"
      class="text-center"
    >
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
  },
  beforeRouteLeave(to, from, next) {
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
    if (!this.inschrijven) next()
    else {
      const answer = window.confirm(
        'Jouw inschrijving is nog niet opgeslagen. Weet je zeker dat je deze pagina wil verlaten?'
      )
      if (answer) {
        next()
      } else {
        next(false)
      }
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
