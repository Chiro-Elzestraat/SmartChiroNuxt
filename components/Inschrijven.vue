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
                        ><v-text-field
                          v-model="lid.contact.huisarts.naam"
                          label="Naam"
                      /></v-col>
                      <v-col>
                        <v-text-field
                          v-model="lid.contact.huisarts.gsm"
                          v-mask="mask"
                          label="Gsm"
                          :rules="gsmRules"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
                <v-row>
                  <v-checkbox
                    v-model="lid.medischeFiche.tetanus.gevaccineerd"
                    :label="
                      `${
                        lid.naam ? lid.naam.split(/\s(.+)/)[0] : ''
                      } is gevaccineerd tegen tetanus`
                    "
                  ></v-checkbox>
                  &nbsp;
                  <v-text-field
                    label="In het jaar (optioneel)"
                    v-model="lid.medischeFiche.tetanus.jaar"
                    :disabled="!lid.medischeFiche.tetanus.gevaccineerd"
                  ></v-text-field>
                </v-row>
                <v-row>
                  <v-textarea
                    outlined
                    auto-grow
                    v-model="lid.medischeFiche.vroegereZiekten"
                    label="Vroegere ziekten of heelkundige ingrepen"
                  ></v-textarea>
                </v-row>
                <v-row>
                  {{ lid.naam ? lid.naam.split(/\s(.+)/)[0] : '' }} lijdt aan
                  <Aandoeningen
                    :lidAandoeningen="lid.medischeFiche.aandoeningen"
                  />
                </v-row>
                <v-row>
                  <v-card outlined class="allergieen">
                    <v-card-title>Allergieën</v-card-title>
                    <v-card-subtitle
                      >Voeg hier eventuele allergieën toe.</v-card-subtitle
                    >
                    <v-card-text>
                      <Allergieen
                        :lidAllergieen="lid.medischeFiche.allergieen"
                      />
                    </v-card-text>
                  </v-card>
                </v-row>
                <v-row>
                  <v-textarea
                    v-model="lid.medischeFiche.extraInfo"
                    outlined
                    auto-grow
                    label="Extra informatie in verband met aandoeningen &amp; allergieën."
                  />
                </v-row>
                <v-row>
                  <v-radio-group v-model="lid.medischeFiche.dieet" row
                    ><span style="margin: auto 0;"
                      >Volgt
                      {{ lid.naam ? lid.naam.split(/\s(.+)/)[0] : '' }} een
                      dieet?&nbsp;</span
                    ><v-radio
                      :value="true"
                      default
                      label="Ja, namelijk"/><v-text-field
                      v-model="lid.medischeFiche.dieetDetails"
                      :disabled="!lid.medischeFiche.dieet"/>
                    <v-radio :value="false" label="Nee"
                  /></v-radio-group>
                </v-row>
                <v-row>
                  <v-col>
                    <v-checkbox
                      v-model="lid.medischeFiche.kanZwemmen"
                      label="Kan zwemmen"
                      hide-details
                    />

                    <v-checkbox
                      v-model="lid.medischeFiche.vlugMoe"
                      label="Is vlug moe"
                      hide-details
                    />
                    <v-checkbox
                      v-model="lid.medischeFiche.kanDeelnemen"
                      label="Kan deelnemen aan sport en spel afgestemd op zijn leeftijd"
                      hide-details
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-card outlined>
                    <v-card-text>
                      <p>
                        Leiding mag - behalve EHBO - niet op eigen initiatief
                        medische handelingen uitvoeren. Zonder toestemming van
                        de ouders mogen ze zelfs geen pijnstillende of
                        koortswerende medicatie toedienen, zoals Perdolan,
                        Dafalgan of aspirines. Hieronder kunt u hen die
                        toestemming geven zodat ze voor dergelijke zorgen niet
                        naar een arts moeten.
                      </p>
                      <v-checkbox
                        v-model="lid.medischeFiche.medischeHandelingen"
                        hide-details
                        label="Ja, wij geven toestemming"
                      ></v-checkbox>
                    </v-card-text>
                  </v-card>
                </v-row>
              </v-card-text>
            </v-card>
            <v-textarea
              outlined
              v-model="lid.AanvullendeInfo"
              label="Aanvullende opmerkingen (optioneel)"
            ></v-textarea>
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
        <v-tabs v-model="extraTab">
          <v-tab v-for="(extraContact, extraIndex) in extra" :key="extraIndex">
            {{
              extraContact.naam
                ? extraContact.naam.split(/\s(.+)/)[0]
                : 'Nieuwe contactpersoon'
            }}
          </v-tab>
          <v-btn @click="voegExtraToe" class="plusknop"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </v-tabs>
        <v-tabs-items v-model="extraTab">
          <v-tab-item
            v-for="(extraContact, extraIndex) in extra"
            :key="extraIndex"
          >
            <v-btn v-if="extraIndex > 0" @click="verwijderExtra(extraIndex)"
              >Verwijder contactpersoon</v-btn
            >
            <ExtraInfo :extraProp="extraContact" />
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-card>
    <v-btn
      @click="inschrijven"
      color="primary"
      class="inschrijfknop"
      :loading="laden"
      :disabled="!dataInOrde"
      >Inschrijven</v-btn
    >
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
    <!-- <CheckGegevens /> -->
    <v-dialog v-model="betalen" fullscreen>
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Betaling</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="
                () => {
                  betalen = false
                  $emit('ingeschreven')
                }
              "
              >Klaar</v-btn
            >
          </v-toolbar-items>
        </v-toolbar>
        <v-list three-line subheader>
          <v-subheader>Ingeschreven leden</v-subheader>
          <v-list-item v-for="(lid, index) in leden" :key="index">
            <v-list-item-content>
              <v-list-item-title>{{ lid.naam }}</v-list-item-title>
              <v-list-item-subtitle>{{
                lid.geboortedatum
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list three-line subheader>
          <v-subheader>Informatie overschrijving</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Rekeningnummer</v-list-item-title>
              <v-list-item-subtitle>BE97 8601 0855 9449</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Mededeling</v-list-item-title>
              <v-list-item-subtitle>{{ betalingsId }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Bedrag</v-list-item-title>
              <v-list-item-subtitle>{{
                `€ ${teBetalen.toFixed(2)}`
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-card-text class="text-center"
          >Gelieve deze betaling zo snel mogelijk in orde te brengen zodat wij
          uw leden correct kunnen verzekeren.</v-card-text
        >
      </v-card></v-dialog
    >
    <v-overlay v-if="laden">
      <p>Jouw inschrijving wordt vervolledigd. Sluit deze pagina niet.</p>
      <v-progress-circular
        indeterminate
        size="64"
        style="margin: 0 auto; display:block;"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import { mask } from 'vue-the-mask'
import Geboortedatum from '@/components/Geboortedatum'
import OuderInfo from '@/components/OuderInfo'
import ExtraInfo from '@/components/ExtraInfo'
import Aandoeningen from '@/components/Aandoeningen'
import Allergieen from '@/components/Allergieen'
// import CheckGegevens from '@/components/CheckGegevens'
import { db } from '@/plugins/firebase'
export default {
  directives: {
    mask
  },
  components: {
    Geboortedatum,
    OuderInfo,
    ExtraInfo,
    Aandoeningen,
    Allergieen
    // CheckGegevens
  },
  data() {
    return {
      betalen: false,
      laden: false,
      tab: null,
      ouderTab: null,
      extraTab: null,
      leden: [
        {
          medischeFiche: {
            tetanus: {},
            aandoeningen: {},
            allergieen: []
          },
          contact: {
            huisarts: {
              naam: '',
              gsm: ''
            }
          },
          geboortedatum: ''
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
          gsm: '',
          relatie: ''
        }
      ],
      valid: true,
      name: '',
      mask: '+## ### ## ## ##',
      nameRules: [(v) => !!v || 'Naam is verplicht'],
      regexGsm: new RegExp('^[+][0-9]{2} [0-9]{3}( [0-9]{2}){3}$'),
      gsmRules: [
        (value) =>
          this.regexGsm.test(value) ||
          value === '+32' ||
          'Ongeldig gsm-nummer. Verwacht formaat: +32 015 45 67 89'
      ],
      email: '',
      select: null,
      checkbox: false,
      picker: new Date().toISOString().substr(0, 10),
      teBetalen: 0,
      betalingsId: ''
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
  computed: {
    ledenAlles() {
      let leden = [...this.leden]
      leden = leden.map((lid) => {
        lid.contact.ouders = this.ouders
        lid.contact.extra = this.extra
        lid.ouderId = [this.$store.state.gebruiker.user.data.uid]
        lid.adres = this.adres
        return lid
      })
      return leden
    },
    dataInOrde() {
      const adres = this.adres
      let valid = true
      if (
        !adres.straat ||
        !adres.postcode ||
        !adres.huisnummer ||
        !adres.plaats
      )
        valid = false
      this.ledenAlles.forEach((lid) => {
        if (
          !lid.naam ||
          !lid.geboortedatum ||
          !lid.contact.huisarts.gsm ||
          !lid.contact.huisarts.naam
        ) {
          valid = false
        }
      })
      return valid
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
      this.leden.push({
        medischeFiche: {
          tetanus: {},
          aandoeningen: {},
          allergieen: []
        },
        contact: {
          huisarts: {
            naam: '',
            gsm: ''
          }
        },
        geboortedatum: ''
      })
      this.tab = this.leden.length - 1
    },
    voegOuderToe() {
      this.ouders.push({ naam: '', email: '', gsm: '+32' })
      this.ouderTab = this.ouders.length - 1
    },
    voegExtraToe() {
      this.extra.push({ naam: '', gsm: '', relatie: '' })
      this.extraTab = this.extra.length - 1
    },
    verwijderLid(index) {
      this.leden.splice(index, 1)
    },
    verwijderOuder(index) {
      this.ouders.splice(index, 1)
    },
    verwijderExtra(index) {
      this.extra.splice(index, 1)
    },
    save(refs, geboortedatum) {
      this.$refs[refs][0].save(geboortedatum)
    },
    setDatum(date, index) {
      this.leden[index].geboortedatum = date
    },
    inschrijven() {
      this.laden = true
      const batch = db.batch()
      const ledenIds = []
      this.ledenAlles.forEach((lid) => {
        const doc = db.collection('leden').doc()
        batch.set(doc, lid)
        ledenIds.push(doc.id)
      })
      const betaling = db.collection('startbetaling').doc()
      batch.set(betaling, { leden: ledenIds })
      batch
        .commit()
        .then((result) => {
          ledenIds.forEach((lidId) => {
            db.collection('leden')
              .doc(lidId)
              .collection('betaling')
              .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                  if (change.type === 'added') {
                    this.teBetalen += change.doc.data().bedrag
                    this.betalingsId = change.doc.data().betalingsnummer
                    this.laden = false
                    this.betalen = true
                    // this.$emit('ingeschreven')
                  }
                })
              })
          })
        })
        .catch((err) => console.log(err))
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
.allergieen {
  margin: 16px auto;
  width: 90%;
}
</style>
