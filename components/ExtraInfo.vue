<template>
  <v-card class="extrainfo">
    <v-row>
      <v-col
        ><v-text-field
          v-model="extra.naam"
          label="Naam"
          :rules="rules.nietLeeg"
        ></v-text-field
      ></v-col>
      <v-col>
        <v-text-field
          v-model="extra.gsm"
          v-mask="mask"
          :rules="rules.gsm"
          label="Gsm"
          hint="in het formaat +32 123 45 67 89"
        >
        </v-text-field
      ></v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mask } from 'vue-the-mask'
export default {
  directives: {
    mask
  },
  props: {
    extra: {
      type: Object,
      default: () => ({ naam: '', gsm: '+32' })
    }
  },
  data() {
    return {
      mask: '+## ### ## ## ##',
      regexGsm: new RegExp('^[+][0-9]{2} [0-9]{3}( [0-9]{2}){3}$'),
      rules: {
        nietLeeg: [(value) => !!value || 'Gelieve dit veld in te vullen.'],
        gsm: [
          (value) =>
            this.regexGsm.test(value) ||
            value === '+32' ||
            'Ongeldig gsm-nummer. Verwacht formaat: +32 123 45 67 89'
        ]
      }
    }
  }
}
</script>

<style>
.extrainfo {
  padding: 16px;
}
</style>
