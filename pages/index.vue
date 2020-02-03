<template>
  <div>
    <!-- <h1>Welkom op SmartChiro!</h1> -->
    <Inschrijven v-if="this.$store.state.gebruiker.user.ouder" />
  </div>
</template>

<script>
import Inschrijven from '@/components/Inschrijven'
export default {
  components: {
    Inschrijven
  }
}
</script>
