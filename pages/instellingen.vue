<template>
  <div>
    <Rollenbeheer v-if="groepsleider" />

    <p v-else class="text-center">Het is hier voorlopig leeg.</p>
  </div>
</template>

<script>
import Rollenbeheer from '@/components/Rollenbeheer'
export default {
  components: {
    Rollenbeheer
  },
  computed: {
    groepsleider() {
      return (
        this.$store.state.gebruiker.user.groepsleider ||
        this.$store.state.gebruiker.user.website
      )
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
