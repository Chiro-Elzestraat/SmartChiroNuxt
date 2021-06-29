<template>
  <v-container>
    <v-card class="card">
      <v-img :src="uitstap.url" class="white--text align-end" height="200px">
        <v-card-title>{{ uitstap.titel }}</v-card-title>
      </v-img>

      <v-card-subtitle class="pb-0"
        ><span v-if="uitstap.isKamp"
          >Speelclub: {{ uitstap.datesSpeelclub[0] }} t.e.m.
          {{ uitstap.datesSpeelclub[1] }}<br /></span
        >{{ uitstap.dates[0] }} t.e.m. {{ uitstap.dates[1] }}<br />Deadline voor
        inschrijven: {{ uitstap.deadline }}
      </v-card-subtitle>

      <v-card-text class="text--primary">
        {{ uitstap.beschrijving }}
        <v-row style='margin-top: 16px'>
          <v-chip
            :color="groep.geselecteerd ? 'green' : ''"
            v-for="(groep, index) in uitstap.groepen"
            :key="index"
            class="groep"
            >{{ groep.naam }}
          </v-chip>
        </v-row>
        <v-row v-if="$store.state.gebruiker.user.ouder">
          <v-col>
            <v-chip
              :color="lid.geselecteerd || lid.ingeschreven ? 'primary' : ''"
              v-for="(lid, index) in ledenAlles"
              :key="index"
              :disabled="lid.ingeschreven"
              @click="lid.geselecteerd = !lid.geselecteerd"
              class="groep"
              >{{ lid.naam }}
              <v-icon v-if="lid.ingeschreven">{{
                lid.betaald ? 'mdi-check' : 'mdi-clock-outline'
              }}</v-icon>
            </v-chip>
          </v-col>
          <v-col>
            Totaalprijs: €
            {{ totaalPrijs.toFixed(2) }}
          </v-col>
        </v-row>
        <v-row v-else-if="$store.state.gebruiker.user.leider">
          <v-col>
            <v-container>
              <v-col
                ><h1>Totaal: {{ aantalIngeschrevenLeden }} leden</h1></v-col
              >
              <v-col v-if='uitstap.heeftBbq'><h2>BBQ</h2>

              <ul><li>Volwassenporties: {{aantalBbq.volwassenPorties}}</li><li>Kinderporties: {{aantalBbq.kinderPorties}}</li></ul></v-col>
              <v-col><v-btn @click="krijgMails"><v-icon style='margin-right: 10px'>mdi-email</v-icon>Krijg emails</v-btn></v-col>
            </v-container>
            <v-dialog v-model="toonMails">
              <v-card>
                <v-card-title>Alle mails</v-card-title>
                <v-card-text>{{ mails }}</v-card-text>
                <v-card-actions>
                  <v-btn @click="toonMails = false">Sluit</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-list>
              <v-list-item v-for="(lid, index) in ledenAlles" :key="index">
                <v-list-item-content v-if='lid.leden.length === 0'>
                  <div v-if='lid.bbq' class='bbq-bestelling'>
                    <h3 class='extra-bbq'>Extra BBQ bestelling</h3>
                    <p>BBQ naam: {{lid.bbq.naam}}</p>
                    <p>Volwassenporties: {{lid.bbq.volwassenPorties}}</p>
                    <p>Kinderporties: {{lid.bbq.kinderPorties}}</p>
                  </div>
                </v-list-item-content>
                <v-list-item-content
                  v-for="(lidGegevens, index) in lid.leden"
                  :key="index"
                >
                  <v-list-item-title>{{ lidGegevens.naam }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    lidGegevens.lidId
                  }}</v-list-item-subtitle>
                    <div v-if='index == 0 && lid.bbq && (lid.bbq.kinderPorties > 0 || lid.bbq.volwassenPorties > 0)' class='bbq-bestelling'>
                      <p>BBQ naam: {{lid.bbq.naam}}</p>
                      <p>Volwassenporties: {{lid.bbq.volwassenPorties}}</p>
                      <p>Kinderporties: {{lid.bbq.kinderPorties}}</p>
                    </div>
                </v-list-item-content>
                <v-list-item-icon>
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        v-on="on"
                        @click="kopierNummer(lid.betalingsnummer)"
                      >
                        {{ lid.betaald ? 'mdi-check' : 'mdi-close' }}
                      </v-icon>
                    </template>
                    <span>{{ lid.betalingsnummer }}</span>
                  </v-tooltip>
                </v-list-item-icon>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
      <v-actions>
        <button @click="startInschrijven"
          :loading="laden"
          :disabled="geselecteerd.length == 0 || deadlineVerlopen"
          v-if="gebruiker.ouder"
          class='inschrijf-knop'
          text
          color="primary"
          >{{
            deadlineVerlopen
              ? 'Inschrijvingen afgelopen'
              : 'Inschrijving vervolledigen'
          }}
        </button>
        <button @click="startInschrijven"
                :loading="laden"
                v-if="gebruiker.ouder && !deadlineVerlopen && uitstap.heeftBbq"
                class='inschrijf-knop bbq'
                text
                color="primary"
        >
          Extra BBQ bestelling
        </button>
      </v-actions>
    </v-card>
    <v-dialog
      v-model="betalen"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Betaling</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              @click="
                () => {
                  betalen = false
                  laadGegevens()
                }
              "
              dark
              text
              >Klaar
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list three-line subheader>
          <v-subheader>Ingeschreven leden</v-subheader>
          <v-list-item v-for="(lid, index) in geselecteerd" :key="index">
            <v-list-item-content>
              <v-list-item-title>{{ lid.naam }}</v-list-item-title>
              <v-list-item-subtitle
                >{{ lid.geboortedatum }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-row class="pr-0 mr-0">
          <v-col>
            <v-list three-line subheader>
              <v-subheader>Informatie overschrijving</v-subheader>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Rekeningnummer</v-list-item-title>
                  <v-list-item-subtitle
                    >BE97 8601 0855 9449</v-list-item-subtitle
                  >
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
                  <v-list-item-subtitle
                    >{{ `€ ${teBetalen.toFixed(2)}` }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col class="pr-0 mr-0 text-center hidden-xs-only">
            <p>
              Scan de QR-code met je bankapp om met je smartphone te betalen.
            </p>
            <vue-qrcode :value="betalingQr" :options="{ width: 200 }" />
          </v-col>
        </v-row>
        <v-card-text class="text-center"
          >Gelieve deze betaling zo snel mogelijk in orde te brengen.
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="gekopieerd">
      Betalingsnummer gekopierd
    </v-snackbar>
    <v-dialog v-model="error" width="500">
      <v-card
        ><v-card-title>Er is iets fout gegaan</v-card-title>
        <v-card-text
          >De inschrijving kon niet worden voltooid vanwege een probleem met de
          betalingsserver. Als dit probleem zich blijft aanhouden, gelieve
          contact op te nemen met
          <a href="mailto:contact@chiroelzestraat.be"
            >contact@chiroelzestraat.be</a
          ></v-card-text
        ></v-card
      >
      <v-btn @click="error = false">Ok</v-btn>
    </v-dialog>
    <v-dialog v-model='bbqDialog' width='500'>
      <v-card>
        <v-card-title>Bbq inschrijving</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>Indien u dit wenst, kan u nu al meteen reserveren voor de BBQ.</v-col>
          </v-row>
          <v-row>
            <v-col><v-radio-group v-model="bbqKeuze">
              <v-radio  v-if='geselecteerd.length > 0' label='Ja, ik wil reserveren voor de BBQ'></v-radio>
              <div v-if='bbqKeuze === 0 || geselecteerd.length < 1'>
                <v-text-field
                  v-model="bbq.naam"
                  label="Naam"
                  outlined
                ></v-text-field>
                Aantal kinderporties (€{{uitstap.kostprijsKinderportie}} * {{bbq.kinderPorties}} = €{{uitstap.kostprijsKinderportie * bbq.kinderPorties}})
                <v-row>

                  <v-col><v-slider
                    v-model="bbq.kinderPorties"
                    :thumb-label='bbq.kinderPorties > 0 ? "always" : ""'
                    min='0'
                    max='15'
                    ticks="always"
                  ></v-slider></v-col>
                </v-row>
                Aantal volwassenporties (€{{uitstap.kostprijsVolwassenportie}} * {{bbq.volwassenPorties}} = €{{uitstap.kostprijsVolwassenportie * bbq.volwassenPorties}})
                <v-row><v-col><v-slider
                  v-model="bbq.volwassenPorties"
                  :thumb-label='bbq.volwassenPorties > 0 ? "always" : ""'
                  ticks="always"
                  min='0'
                  max='15'
                ></v-slider></v-col></v-row>
              </div>
              <v-radio v-if='geselecteerd.length > 0' label='Nee, ik wil niet reserveren'></v-radio>
            </v-radio-group></v-col>
          </v-row>
          Totaalprijs: €{{totaalPrijs.toFixed(2)}}(Kamp) + €{{bbqPrijs.toFixed(2)}}(BBQ) = €{{(totaalPrijs + bbqPrijs).toFixed(2)}}
        </v-card-text>
        <v-card-actions><v-btn @click='inschrijven' :loading='laden' text color='primary'>Inschrijving bevestigen</v-btn></v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import VueQrcode from '@chenfengyuan/vue-qrcode'
import { db, storage } from '@/plugins/firebase'

export default {
  components: {
    VueQrcode
  },
  data() {
    return {
      uitstap: {
        dates: []
      },
      bbqKeuze: 0,
      ledenAlles: [],
      bbqDialog: false,
      bbq: {
        kinderPorties: 0,
        volwassenPorties: 0,
        naam: '',
      },
      laden: false,
      error: false,
      betalen: false,
      teBetalen: 0,
      betalingsId: '',
      lidIds: [],
      gekopieerd: false,
      mails: '',
      toonMails: false
    }
  },
  computed: {
    bbqPrijs(){
      return this.bbqBestelling.kinderPorties * this.uitstap.kostprijsKinderportie + this.bbqBestelling.volwassenPorties * this.uitstap.kostprijsVolwassenportie
    },
    bbqBestelling(){
      if(this.bbqKeuze === 0 || this.geselecteerd.length === 0){
        return this.bbq
      }else{
        return {
          kinderPorties: 0,
          volwassenPorties: 0,
        }
      }
    },
    betalingQr() {
      return `BCD
002
2
SCT

Chirojongens Elzestraat
BE97860108559449
EUR${this.teBetalen.toFixed(2)}

${this.betalingsId}`
    },
    totaalPrijs() {
      let result = 0
      const prices = []
      this.ledenAlles.forEach((lid) => {
        if (lid.geselecteerd) {
          prices.push(
            this.isSpeelclub(lid)
              ? parseFloat(this.uitstap.kostprijsSpeelclub)
              : parseFloat(this.uitstap.kostprijs)
          )
        }
      })
      if (this.uitstap.geefKorting) {
        for (let i = 0; i < prices.length - 2; i += 2) {
          result -= 30
        }
      }
      prices.forEach((p) => {
        result += p
      })
      return result
    },
    deadlineVerlopen() {
      return (
        new Date().getTime() >=
        new Date(new Date(this.uitstap.deadline).getTime() + 86400000)
      )
    },
    leden() {
      return this.ledenAlles.map((lid) => {
        return {
          naam: lid.naam,
          lidId: lid.lidId,
          geselecteerd: lid.geselecteerd
        }
      })
    },
    aantalIngeschrevenLeden() {
      let result = 0
      this.ledenAlles.forEach((inschrijving) => {
        result += inschrijving.leden.length
      })
      return result
    },
    aantalBbq(){
      const result = {volwassenPorties: 0, kinderPorties: 0}
      this.ledenAlles.forEach((inschrijving) => {
        result.volwassenPorties += inschrijving.bbq.volwassenPorties
        result.kinderPorties += inschrijving.bbq.kinderPorties
      })
      return result
    },
    geselecteerd() {
      const geselecteerd = this.leden.filter((lid) => {
        if (lid.geselecteerd) return true
      })
      const result = []
      geselecteerd.forEach((item) => {
        const { geselecteerd, ...lid } = item
        result.push(lid)
      })
      return result
    },
    gebruiker() {
      return this.$store.state.gebruiker.user
    }
  },
  mounted() {
    this.laadGegevens()
    this.bbq.naam = this.$store.state.gebruiker.user.data.displayName
  },
  methods: {
    isSpeelclub(lid) {
      const vandaag = new Date()
      const maand = vandaag.getMonth()
      const vergelijkDatum =
        maand < 8
          ? new Date(vandaag.getFullYear() - 1, 12, 0)
          : new Date(vandaag.getFullYear(), 12, 0)
      const chiroLeeftijd = lid.chiroLeeftijd ?? 0
      let lidGeboortedatum = new Date(lid.geboortedatum)
      if (this.geselecteerdJaar !== this.chiroJaar)
        lidGeboortedatum = lidGeboortedatum.setMonth(0)
      const leeftijd =
        (vergelijkDatum - lidGeboortedatum) / (1000 * 3600 * 24 * 365) +
        chiroLeeftijd

      if (leeftijd <= 9 && leeftijd > 0) {
        return true
      }
      return false
    },
    kopierNummer(betalingsnummer) {
      navigator.clipboard.writeText(betalingsnummer).then(() => {
        this.gekopieerd = true
      })
    },
    startInschrijven(){
      if(!this.uitstap.heeftBbq){
        this.inschrijven()
      }else{
        this.bbqDialog = true
      }
    },
    inschrijven() {
      this.laden = true
      this.$axios
        .post('uitstap/betaal', {
          uitstapId: this.uitstap.id,
          leden: this.geselecteerd,
          bbq: this.bbqBestelling
        })
        .then((response) => {
          this.betalen = true
          this.laden = false
          this.betalingsId = response.data.betalingsnummer
          this.teBetalen = response.data.bedrag
          this.bbqDialog = false
        })
        .catch((err) => {
          console.error(err)
          this.error = true
          this.laden = false
        })
    },
    laadIngeschreven() {},
    laadGegevens() {
      this.lidIds = []
      db.collection('uitstap')
        .doc(this.$route.params.id)
        .get()
        .then((doc) => {
          storage
            .ref(`uitstap/${doc.id}`)
            .getDownloadURL()
            .then((url) => {
              this.uitstap = { ...doc.data(), url, id: doc.id }
            })
            .catch(function(error) {
              console.warn(error)
            })
          if (this.gebruiker.ouder) {
            db.collection('leden')
              .where(
                'ouderId',
                'array-contains',
                this.$store.state.gebruiker.user.data.uid
              )
              .get()
              .then((snap) => {
                this.ledenAlles = snap.docs.map((item) => {
                  return { ...item.data(), lidId: item.id, geselecteerd: false }
                })
                snap.docs.forEach((item) => {
                  this.lidIds.push({ lidId: item.id, naam: item.data().naam })
                })
                db.collection('uitstap')
                  .doc(doc.id)
                  .collection('betaling')
                  .where('leden', 'array-contains-any', this.lidIds)
                  .get()
                  .then((inschrijvingen) => {
                    inschrijvingen.docs.forEach((doc) => {
                      this.ledenAlles = this.ledenAlles.map((lid) => {
                        if (
                          doc.data().leden.some((l) => l.lidId === lid.lidId)
                        ) {
                          return {
                            ...lid,
                            ingeschreven: true,
                            betaald: doc.data().betaald
                          }
                        }
                        return lid
                      })
                    })
                  })
              })
          } else if (this.gebruiker.leider) {
            const ref = db
              .collection('uitstap')
              .doc(this.$route.params.id)
              .collection('betaling')
            ref.get().then((inschrijvingen) => {
              inschrijvingen.docs.forEach((doc) => {
                this.ledenAlles.push(doc.data())
              })
            })
          }
        })
    },
    krijgMails() {
      this.ledenAlles.forEach((inschrijving) => {
        inschrijving.leden.forEach((lid) => {
          db.collection('leden')
            .doc(lid.lidId)
            .get()
            .then((result) => {
              result.data().contact.ouders.forEach((ouder) => {
                if (ouder.email.includes('@')) this.mails += ouder.email + ';'
              })
              this.toonMails = true
            })
        })
      })
    }
  }
}
</script>

<style>
.bbq-bestelling{
  display: flex;
  flex-direction: column;
}
.extra-bbq{
  margin-bottom: 1em;
  border-radius: 15px;
  align-self: flex-start;
  justify-self: flex-start;
  color: #dd042b;
  background: white;
  padding: 0.25em 0.75em;
}
.bbq-bestelling p{
  margin-bottom: 0px;
}
*{
  box-sizing: border-box;
}
.groep {
  margin: 8px;
}
.inschrijf-knop{
  padding: 0.75em 1.25em;
  background: #dd042b;
  border-radius: 15px;
  margin: 0 1em 1em 1em;
  transition: 0.2s;
}
.inschrijf-knop:is(:hover, :focus):not(:disabled){
  background: white;
  color: black;
}
.inschrijf-knop[disabled]{
  opacity: 50%;
  background: gray;
}
.inschrijf-knop.bbq{
  background: transparent;
  border: 2px solid #dd042b;
}
.inschrijf-knop.bbq:hover{
  border: 2px solid transparent;
}
</style>
