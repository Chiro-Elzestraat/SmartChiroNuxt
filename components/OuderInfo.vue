<template>
  <v-card class="ouderinfo">
    <v-row>
      <v-col
        ><v-text-field v-model="ouder.naam" label="Naam"></v-text-field
      ></v-col>
      <v-col
        ><v-text-field
          v-model="ouder.email"
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field
      ></v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    ouderProp: {
      type: Object,
      default: () => {
        return { naam: '', email: '', gsm: '' }
      }
    }
  },
  computed: {
    ouder: {
      get() {
        return this.ouderProp
      },
      set(ouder) {
        this.$emit('ouder-updatet', ouder)
      }
    }
  }
}
</script>

<style>
.ouderinfo {
  padding: 16px;
}
</style>
