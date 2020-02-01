<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="date"
        v-on="on"
        label="Geboortedatum"
        prepend-icon="mdi-calendar"
        readonly
      ></v-text-field>
    </template>
    <v-date-picker
      ref="picker"
      v-model="date"
      :max="new Date().toISOString().substr(0, 10)"
      @change="save"
      min="1950-01-01"
      first-day-of-week="1"
      locale="nl"
    ></v-date-picker>
  </v-menu>
</template>
<script>
export default {
  data: () => ({
    date: null,
    menu: false
  }),
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  methods: {
    save(date) {
      this.$refs.menu.save(date)
      this.$emit('date-change', date)
    }
  }
}
</script>
