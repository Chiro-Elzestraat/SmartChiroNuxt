<template>
  <div>
    <OptieDivider
      v-if="this.$store.state.gebruiker.user.leider"
      text="Rollenbeheer"
      icon="mdi-account-multiple"
    />
    <p v-else class="text-center">Het is hier voorlopig leeg.</p>
  </div>
</template>

<script>
import OptieDivider from '@/components/OptieDivider'
export default {
  components: {
    OptieDivider
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
