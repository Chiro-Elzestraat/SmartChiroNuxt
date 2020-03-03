<template>
  <div class="nieuweGebruiker">
    <v-stepper v-model="huidig">
      <v-stepper-header>
        <template>
          <v-stepper-step :complete="huidig > 1" step="1">
            Aanvullen gegevens
          </v-stepper-step>
          <v-divider />
          <v-stepper-step :complete="huidig > 2" step="2">
            Voorwaarden
          </v-stepper-step>
        </template>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <div class="invoer">
            <v-text-field
              v-model="gebruiker.naam"
              :rules="rules.nietLeeg"
              label="Naam"
              hint="voor- en achternaam"
            >
            </v-text-field>
            <v-text-field
              v-model="gebruiker.gsm"
              v-mask="mask"
              :rules="rules.gsm"
              @keyup.enter="huidig++"
              label="Gsm"
              hint="in het formaat +32 123 45 67 89"
            ></v-text-field>
          </div>
          <v-btn @click="huidig++" :disabled="!gegevensInOrde" color="primary">
            Verder
          </v-btn>
        </v-stepper-content>
        <v-stepper-content step="2">
          <div class="invoer">
            <v-checkbox v-model="privacy">
              <template v-slot:label>
                <div>
                  Ik ga akkoord met het
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <a
                        @click.stop
                        v-on="on"
                        target="_blank"
                        href="https://privacy.chiroelzestraat.be"
                      >
                        privacybeleid
                      </a>
                    </template>
                    Opent in een nieuw tabblad. </v-tooltip
                  >.
                </div>
                <!--TODO: nog een optie voor leider i.p.v. ouder maken!!!!! -->
              </template>
            </v-checkbox>
          </div>
          <v-btn
            :disabled="!privacy"
            @click="maakProfiel()"
            :loading="laden"
            color="primary"
          >
            Verder
          </v-btn>
          <v-btn @click="huidig--" :disabled="laden" text>Terug</v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <v-card outlined class="help">
      <v-icon>mdi-information-outline</v-icon> Informatie over hoe wij omgaan
      met jouw data vind je terug in ons
      <a href="https://privacy.chiroelzestraat.be" target="_blank"
        >privacybeleid</a
      >.<br />
      <v-icon>mdi-help-circle-outline</v-icon> Hulp nodig? Neem contact op met
      <a href="mailto:smart@chiroelzestraat.be">smart@chiroelzestraat.be</a>
    </v-card>
  </div>
</template>

<script>
import { mask } from 'vue-the-mask'
import firebase from 'firebase'
import { db } from '../plugins/firebase'
export default {
  directives: {
    mask
  },
  data() {
    return {
      laden: false,
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
      regexGsm: new RegExp('^[+][0-9]{2} [0-9]{3}( [0-9]{2}){3}$'),
      privacy: false
    }
  },
  computed: {
    gegevensInOrde() {
      return this.regexGsm.test(this.gebruiker.gsm) && this.gebruiker.naam
    }
  },
  methods: {
    maakProfiel() {
      this.laden = true
      db.collection('gebruikers')
        .doc(this.$store.state.gebruiker.user.data.uid)
        .set({
          naam: this.gebruiker.naam,
          gsm: this.gebruiker.gsm,
          rollen: ['ouder']
        })
        .then(() => {
          db.collection('gebruikers')
            .doc(this.$store.state.gebruiker.user.data.uid)
            .onSnapshot((doc) => {
              console.log(doc.data())
              if (doc.data().rollen_ok) {
                firebase
                  .auth()
                  .currentUser.getIdToken(true)
                  .then(() => {
                    this.laden = false
                    this.$store.commit('gebruiker/setNieuweGebruiker', false)
                    this.$store.commit('gebruiker/setOuder', true)
                  })
                  .catch((error) => {
                    window.alert(
                      `Er is iets fout gegaan. Foutcode: ${error.code}. Foutmelding: ${error.message}`
                    )
                  })
              }
            })
        })
        .catch((err) => {
          console.log(err)
          this.laden = false
        })
      firebase.auth().currentUser.updateProfile({
        displayName: this.gebruiker.naam
      })
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
