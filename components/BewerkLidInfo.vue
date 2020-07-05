<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" dark icon style="margin: 16px;"
        ><v-icon color="primary">mdi-account-edit</v-icon></v-btn
      >
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-dialog width="500" v-model="cancelDialog">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon dark>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>Wijzigingen verwerpen</v-card-title>
            <v-card-text
              >Weet u zeker dat u de wijzigingen niet wil oplsaan?</v-card-text
            >
            <v-card-actions>
              <v-btn @click="dialog = false" text>Ja</v-btn>
              <v-btn @click="cancelDialog = false" text>Nee</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-toolbar-title>{{ lid.naam }}</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn @click="opslaan" :loading="laden" dark text>Opslaan</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-list three-line subheader>
        <v-list-item>
          <v-row>
            <v-col>
              <v-text-field v-model="lid.naam" label="Naam"></v-text-field>
            </v-col>
          </v-row>
        </v-list-item>
        <v-subheader>Contact</v-subheader>
        <h1 class="headline ml-4">Ouders</h1>
        <v-list-item v-for="(ouder, index) in lid.contact.ouders" :key="index">
          <v-row class="mb-6">
            <v-col cols="12" md="4">
              <v-text-field v-model="ouder.naam" label="Naam"></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="ouder.email" label="E-mail"></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="ouder.gsm" label="Gsm"></v-text-field>
            </v-col>
          </v-row>
        </v-list-item>
        <h1 class="headline ml-4">Extra contactpersonen</h1>
        <v-list-item
          v-for="(extra, index) in lid.contact.extra"
          :key="`extra${index}`"
        >
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field v-model="extra.naam" label="Naam"></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="extra.relatie"
                label="Relatie met deze persoon"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="extra.gsm" label="Gsm"></v-text-field>
            </v-col>
          </v-row>
        </v-list-item>
        <h1 class="headline ml-4">Huisarts</h1>
        <v-list-item>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="lid.contact.huisarts.naam"
                label="Naam"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="lid.contact.huisarts.gsm"
                label="Gsm"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-list-item>
        <v-subheader>Adres</v-subheader>
        <v-list-item>
          <v-row>
            <v-col cols="12" md="6"
              ><v-text-field v-model="lid.adres.plaats" label="Plaats"
            /></v-col>
            <v-col cols="12" md="6"
              ><v-text-field v-model="lid.adres.postcode" label="Postcode"
            /></v-col>
            <v-col cols="12" md="6"
              ><v-text-field v-model="lid.adres.straat" label="Straat"
            /></v-col>
            <v-col cols="12" md="6"
              ><v-text-field v-model="lid.adres.huisnummer" label="Huisnummer"
            /></v-col>
          </v-row>
        </v-list-item>
        <v-subheader>Medische fiche</v-subheader>
        <v-list-item>
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
                        :rules="gsmRules"
                        label="Gsm"
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
                  v-model="lid.medischeFiche.tetanus.jaar"
                  :disabled="!lid.medischeFiche.tetanus.gevaccineerd"
                  label="In het jaar (optioneel)"
                ></v-text-field>
              </v-row>
              <v-row>
                <v-textarea
                  v-model="lid.medischeFiche.vroegereZiekten"
                  outlined
                  auto-grow
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
                    <Allergieen :lidAllergieen="lid.medischeFiche.allergieen" />
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
                    >Volgt {{ lid.naam ? lid.naam.split(/\s(.+)/)[0] : '' }} een
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
                <v-col>
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
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-textarea
                    v-model="lid.aanvullendeInfo"
                    outlined
                    label="Aanvullende opmerkingen (optioneel)"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-list-item>
      </v-list>
    </v-card>
    <v-snackbar v-model="opgeslagen" color="success" top>Opgeslagen</v-snackbar>
  </v-dialog>
</template>

<script>
import { db } from '@/plugins/firebase'
import Aandoeningen from '@/components/Aandoeningen'
import Allergieen from '@/components/Allergieen'
export default {
  components: {
    Aandoeningen,
    Allergieen
  },
  props: {
    lidProp: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      cancelDialog: false,
      dialog: false,
      laden: false,
      opgeslagen: false
    }
  },
  computed: {
    lid() {
      const { lidId, ...lid } = this.lidProp // Hiermee wordt lidId uit het object "lidProp" gefilterd.
      // De reden om dit te filteren, is omdat we dit gegeven niet willen opslagen in de database als waarde (dit is immers al het id van het document waarin het is opgeslagen)
      // Uitleg van hoe de filtering werkt: https://stackoverflow.com/a/45898081
      return lid
    }
  },
  methods: {
    opslaan() {
      this.laden = true
      db.collection('leden')
        .doc(this.lidProp.lidId)
        .set(this.lid)
        .then(() => {
          this.opgeslagen = true
          this.laden = false
        })
        .catch((err) => console.log(err))
    }
  }
}
</script>

<style>
.contact {
  margin: 16px;
  width: 100%;
}
v-text-field {
  margin: 8px;
}
</style>
