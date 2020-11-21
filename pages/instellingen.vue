<template>
  <div>
    <ContactLeider />
    <Rollenbeheer v-if="groepsleider" />
    

    <p v-else class="text-center">Het is hier voorlopig leeg.</p>
  </div>
</template>

<script>
import ContactLeider from '@/components/ContactLeider'
import Rollenbeheer from '@/components/Rollenbeheer'
export default {
  components: {
    Rollenbeheer,
    ContactLeider
  },
  computed: {
    groepsleider() {
      return (
        this.$store.state.gebruiker.user.leider &&
        (this.$store.state.gebruiker.user.groepsleider ||
          this.$store.state.gebruiker.user.website)
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
