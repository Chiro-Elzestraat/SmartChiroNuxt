<template>
  <div>
    <v-card outlined>
      <v-tabs v-model="tab">
        <v-tab v-for="(lid, index) in leden" :key="index">
          {{ lid.naam ? lid.naam.split(/\s(.+)/)[0] : 'Nieuw lid' }}
        </v-tab>
        <v-btn @click="voegLidToe" class="plusknop"
          ><v-icon>mdi-plus</v-icon></v-btn
        >
      </v-tabs>
      <v-tabs-items v-model="tab" class="lidInfo">
        <v-tab-item v-for="(lid, index) in leden" :key="index">
          <v-form :ref="'form' + index" v-model="valid" lazy-validation>
            <v-btn v-if="index > 0" @click="verwijderLid(index)"
              >Verwijder dit lid</v-btn
            >
            <v-row>
              <v-col
                ><v-text-field
                  v-model="lid.naam"
                  :rules="nameRules"
                  label="Naam"
                  hint="Eerst voornaam, daarna achternaam"
                  required
                ></v-text-field
              ></v-col>
              <v-col
                ><Geboortedatum @date-change="setDatum($event, index)"
              /></v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="lid.email"
                  label="E-mail zoon (optioneel)"
                />
              </v-col>
              <v-col> </v-col>
            </v-row>
            <v-card outlined style="padding: 16px;margin: 16px 0;">
              <v-card-title>Medische fiche</v-card-title>
              <v-card-subtitle>{{ lid.naam }}</v-card-subtitle>
              <v-card-text>
                <v-card outlined style="padding: 16px;margin: 16px 0;">
                  <v-card-title>Huisarts</v-card-title>
                  <v-card-subtitle>Contactgegevens</v-card-subtitle>
                  <v-card-text>
                    <v-row>
                      <v-col
                        ><v-text-field v-model="lid.huisarts.naam" label="Naam"
                      /></v-col>
                      <v-col>
                        <v-text-field
                          v-mdoel="lid.huisarts.gsm"
                          label="Gsm"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-card-text>
            </v-card>

            <!-- <v-select
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
          ></v-checkbox> -->
          </v-form>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
    <v-card outlined style="padding: 16px;margin: 16px 0;">
      <v-card-title>Adres</v-card-title>
      <v-card-subtitle
        >Dit adres is hetzelfde voor alle leden die u
        inschrijft.</v-card-subtitle
      >
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field v-model="adres.straat" label="Straat" />
          </v-col>
          <v-col>
            <v-text-field v-model="adres.huisnummer" label="Huisnummer" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="adres.bus" label="Bus (optioneel)" />
          </v-col>
          <v-col>
            <v-text-field v-model="adres.postcode" label="Postcode" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="adres.plaats" label="Plaats" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card outlined style="padding: 16px;margin: 16px 0;">
      <v-card-title>Contactgegevens</v-card-title>
      <v-card-subtitle
        >Deze contactgegevens zijn hetzelfde voor alle leden die u
        inschrijft.</v-card-subtitle
      >
      <v-card outlined class="ouders">
        <v-card-title>Ouders</v-card-title>
        <v-tabs v-model="ouderTab">
          <v-tab v-for="(ouder, ouderIndex) in ouders" :key="ouderIndex">{{
            ouder.naam ? ouder.naam.split(/\s(.+)/)[0] : 'Nieuwe ouder'
          }}</v-tab>
          <v-btn @click="voegOuderToe" class="plusknop"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </v-tabs>

        <v-tabs-items v-model="ouderTab">
          <v-tab-item v-for="(ouder, ouderIndex) in ouders" :key="ouderIndex">
            <v-btn v-if="ouderIndex > 0" @click="verwijderOuder(ouderIndex)"
              >Verwijder deze ouder</v-btn
            >
            <OuderInfo :ouderProp="ouder" />
          </v-tab-item>
        </v-tabs-items>
      </v-card>
      <v-card outlined>
        <v-card-title>Extra contactpersonen</v-card-title>
        <v-card-subtitle>Voor als ouders niet bereikbaar zijn</v-card-subtitle>
        <ExtraInfo :extraProp="extra[0]" />
      </v-card>
    </v-card>
    <v-btn color="primary" class="inschrijfknop">Inschrijven</v-btn>
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
import OuderInfo from '@/components/OuderInfo'
import ExtraInfo from '@/components/ExtraInfo'
import { db } from '@/plugins/firebase'
export default {
  components: {
    Geboortedatum,
    OuderInfo,
    ExtraInfo
  },
  data() {
    return {
      tab: null,
      ouderTab: null,
      leden: [
        {
          huisarts: {}
        }
      ],
      adres: {},
      ouders: [
        {
          naam: this.$store.state.gebruiker.user.data.displayName,
          email: this.$store.state.gebruiker.user.data.email,
          gsm: ''
        }
      ],
      extra: [
        {
          naam: '',
          gsm: ''
        }
      ],
      valid: true,
      name: '',
      nameRules: [(v) => !!v || 'Naam is verplicht'],
      email: '',
      select: null,
      checkbox: false,
      picker: new Date().toISOString().substr(0, 10)
    }
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  created() {
    db.collection('gebruikers')
      .doc(this.$store.state.gebruiker.user.data.uid)
      .get()
      .then((doc) => {
        this.ouders[0].gsm = doc.data().gsm
        console.log(doc.data())
      })
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
      this.leden.push({
        huisarts: {}
      })
      this.tab = this.leden.length - 1
    },
    voegOuderToe() {
      this.ouders.push({ naam: '', email: '', gsm: '+32' })
      this.ouderTab = this.ouders.length - 1
    },
    verwijderLid(index) {
      this.leden.splice(index, 1)
    },
    verwijderOuder(index) {
      this.ouders.splice(index, 1)
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

<style>
.inschrijfknop {
  margin: 16px auto;
  display: block;
  max-width: 60%;
}
.lidInfo {
  padding: 16px;
}
.ouders {
  margin: 16px 0;
}
.plusknop {
  margin: auto 0;
}
</style>
