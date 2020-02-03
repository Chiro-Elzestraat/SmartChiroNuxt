<template>
  <div>
    <v-tabs v-model="tab">
      <v-tab v-for="(lid, index) in leden" :key="index">
        {{ lid.naam ? lid.naam.split(/\s(.+)/)[0] : 'Nieuw lid' }}
      </v-tab>
      <v-btn @click="voegLidToe" class="plusknop"
        ><v-icon>mdi-plus</v-icon></v-btn
      >
    </v-tabs>
    <v-tabs-items v-model="tab">
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
                required
              ></v-text-field
            ></v-col>
            <v-col
              ><Geboortedatum @date-change="setDatum($event, index)"
            /></v-col>
          </v-row>

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
          <OuderInfo
            :ouderProp="ouder"
            @ouder-updatet="setOuder(ouder, index, ouderIndex)"
          />
        </v-tab-item>
      </v-tabs-items>
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
import { db } from '@/plugins/firebase'
export default {
  components: {
    Geboortedatum,
    OuderInfo
  },
  data() {
    return {
      tab: null,
      ouderTab: null,
      leden: [{}],
      ouders: [
        {
          naam: this.$store.state.gebruiker.user.data.displayName,
          email: this.$store.state.gebruiker.user.data.email,
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
      this.leden.push({})
      this.tab = this.leden.length - 1
    },
    voegOuderToe() {
      this.ouders.push({})
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
    },
    setOuder(ouder, lidIndex, ouderIndex) {
      this.leden[lidIndex].test = ouder.naam
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
.ouders {
  margin: 16px 0;
}
.plusknop {
  margin: auto 0;
}
</style>
