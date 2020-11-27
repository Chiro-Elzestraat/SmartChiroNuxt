<template>
  <div>
    <div v-if="leider">
      <Rollenbeheer v-if="groepsleider" />
    </div>

    <p v-else class="text-center">Het is hier voorlopig leeg.</p>
  </div>
</template>

<script>
import Rollenbeheer from '@/components/Rollenbeheer'
export default {
  components: {
    Rollenbeheer,
  },
  computed: {
    groepsleider() {
      return (
        this.$store.state.gebruiker.user.leider &&
        (this.$store.state.gebruiker.user.groepsleider ||
          this.$store.state.gebruiker.user.website)
      )
    },
    leider(){
      return this.$store.state.gebruiker.user.leider
    }
  },
  data() {
    return {}
  },
  head() {
    return {
      title: 'Instellingen'
    }
  }
}
</script>

<style></style>
