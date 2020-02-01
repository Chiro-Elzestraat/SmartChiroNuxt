<template>
  <div>
    <v-tabs v-model="tab">
      <v-tab v-for="(lid, index) in leden" :key="index">
        {{ lid.naam ? lid.naam : 'Nieuw lid' }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="(lid, index) in leden" :key="index">
        <v-form :ref="'form' + index" v-model="valid" lazy-validation>
          <v-btn v-if="index > 0" @click="verwijderLid(index)"
            >Verwijder dit lid</v-btn
          >
          <v-text-field
            v-model="lid.naam"
            :rules="nameRules"
            label="Naam"
            required
          ></v-text-field>
          <Geboortedatum @date-change="setDatum($event, index)" />
          <v-card outlined>
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
            ></v-text-field>
          </v-card>

          <v-select
            v-model="select"
            :items="items"
            :rules="[(v) => !!v || 'Item is required']"
            label="Item"
            required
          ></v-select>

          <v-checkbox
            v-model="checkbox"
            :rules="[(v) => !!v || 'You must agree to continue!']"
            label="Do you agree?"
            required
          ></v-checkbox>
        </v-form>
      </v-tab-item>
    </v-tabs-items>
    <v-btn color="primary">Inschrijven</v-btn>
    <v-btn @click="voegLidToe" color="accent">Voeg nog een lid toe</v-btn>
    <!-- <v-btn
        :disabled="!valid"
        color="success"
        class="mr-4"
        @click="validate('form' + index)"
      >
        Validate
      </v-btn>

      <v-btn color="error" class="mr-4" @click="reset('form' + index)">
        Reset Form
      </v-btn>

      <v-btn color="warning" @click="resetValidation('form' + index)">
        Reset Validation
      </v-btn> -->
  </div>
</template>

<script>
import Geboortedatum from '@/components/Geboortedatum'
export default {
  components: {
    Geboortedatum
  },
  data: () => ({
    tab: null,
    leden: [{}],
    valid: true,
    name: '',
    nameRules: [(v) => !!v || 'Naam is verplicht'],
    email: '',
    emailRules: [
      (v) => !!v || 'E-mail is verplicht',
      (v) => /.+@.+\..+/.test(v) || 'E-mail is ongeldig'
    ],
    select: null,
    items: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
    checkbox: false,
    picker: new Date().toISOString().substr(0, 10)
  }),
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },

  methods: {
    validate(ref) {
      if (this.$refs[ref][0].validate()) {
        this.snackbar = true
      }
    },
    reset(ref) {
      this.$refs[ref][0].reset()
    },
    resetValidation(ref) {
      this.$refs[ref][0].resetValidation()
    },
    voegLidToe() {
      this.leden.push({})
      this.tab = this.leden.length - 1
    },
    verwijderLid(index) {
      this.leden.splice(index, 1)
    },
    save(refs, geboortedatum) {
      this.$refs[refs][0].save(geboortedatum)
    },
    setDatum(date, index) {
      this.leden[index].geboortedatum = date
    }
  }
}
</script>

<style></style>
