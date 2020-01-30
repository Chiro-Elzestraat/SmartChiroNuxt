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
            <v-card-text>
              <v-text-field
                v-model="gebruiker.gsm"
                v-mask="mask"
                label="Gsm"
                hint="in het formaat +32 123 45 67 89"
              ></v-text-field>
            </v-card-text>
          </div>
          <v-btn color="primary" @click="huidig++" :disabled="!geldigGsm">
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
      rules: [(value) => !!value || 'Vereist.'],
      gebruiker: {
        gsm: '32'
      },
      mask: '+## ### ## ## ##'
    }
  },
  computed: {
    geldigGsm() {
      const regex = new RegExp('^[+][0-9]{2} [0-9]{3}( [0-9]{2}){3}$')
      return regex.test(this.gebruiker.gsm)
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
</style>
