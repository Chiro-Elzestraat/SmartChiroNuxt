<template>
  <v-card class="ouderinfo">
    <v-row>
      <v-col
        ><v-text-field
          v-model="ouder.naam"
          :rules="rules.nietLeeg"
          label="Naam"
          hint="Eerst voornaam, daarna achternaam"
        ></v-text-field
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
    <v-row>
      <v-col>
        <v-text-field
          v-model="ouder.gsm"
          v-mask="mask"
          :rules="rules.gsm"
          label="Gsm"
          hint="in het formaat +32 123 45 67 89"
        >
        </v-text-field>
      </v-col>
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
    ouderProp: {
      type: Object,
      default: () => {
        return { naam: '', email: '', gsm: '+32' }
      }
    }
  },
  data() {
    return {
      emailRules: [
        (v) => !!v || 'E-mail is verplicht',
        (v) => /.+@.+\..+/.test(v) || 'E-mail is ongeldig'
      ],
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
  },
  computed: {
    ouder: {
      get() {
        return this.ouderProp
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
