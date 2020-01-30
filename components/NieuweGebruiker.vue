<template>
  <div class="nieuweGebruiker">
    <v-stepper v-model="huidig">
      <v-stepper-header>
        <template>
          <v-stepper-step :complete="huidig > 1" step="1">
            Stap 1
          </v-stepper-step>
          <v-divider />
          <v-stepper-step :complete="huidig > 2" step="2">
            Stap 2
          </v-stepper-step>
        </template>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <div class="invoer">
            <v-text-field
              v-model="gebruiker.naam"
              label="Naam"
              hint="voor- en achternaam"
              :rules="rules.nietLeeg"
            >
            </v-text-field>
            <v-text-field
              v-model="gebruiker.gsm"
              v-mask="mask"
              label="Gsm"
              hint="in het formaat +32 123 45 67 89"
              :rules="rules.gsm"
            ></v-text-field>
          </div>
          <v-btn color="primary" @click="huidig++" :disabled="!gegevensInOrde">
            Verder
          </v-btn>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>
          <v-btn color="primary">
            Verder
          </v-btn>
          <v-btn text @click="huidig--">Terug</v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <v-card outlined class="help">
      <v-icon>mdi-help-circle</v-icon> Hulp nodig? Neem contact op met
      <a href="mailto:smart@chiroelzestraat.be">smart@chiroelzestraat.be</a>
    </v-card>
  </div>
</template>

<script>
import { mask } from 'vue-the-mask'
export default {
  directives: {
    mask
  },
  data() {
    return {
      huidig: 1,
      n: 1,
      rules: {
        nietLeeg: [(value) => !!value || 'Gelieve dit veld in te vullen.'],
        gsm: [
          (value) =>
            this.regexGsm.test(value) ||
            value === '+32' ||
            'Ongeldig gsm-nummer. Verwacht formaat: +32 123 45 67 89'
        ]
      },
      gebruiker: {
        gsm: '32',
        naam: this.$store.state.gebruiker.user.data.displayName
      },
      mask: '+## ### ## ## ##',
      regexGsm: new RegExp('^[+][0-9]{2} [0-9]{3}( [0-9]{2}){3}$')
    }
  },
  computed: {
    gegevensInOrde() {
      return this.regexGsm.test(this.gebruiker.gsm) && this.gebruiker.naam
    }
  }
}
</script>

<style>
.nieuweGebruiker {
  margin: 16px;
}
.invoer {
  margin: 16px;
}
.help {
  margin: 16px;
  text-align: left;
}
</style>
