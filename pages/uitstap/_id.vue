<template>
  <div>
    <v-card class="card">
      <v-img :src="uitstap.url" class="white--text align-end" height="200px">
        <v-card-title>{{ uitstap.titel }}</v-card-title>
      </v-img>

      <v-card-subtitle class="pb-0"
        >{{ uitstap.dates[0] }} - {{ uitstap.dates[1] }}
      </v-card-subtitle>

      <v-card-text class="text--primary">
        {{ uitstap.beschrijving }}
        <v-row>
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
            {{ (uitstap.kostprijs * geselecteerd.length).toFixed(2) }}
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col>
            <h1>Totaal: {{ aantalIngeschrevenLeden }}</h1>
            <v-list>
              <v-list-item v-for="(lid, index) in ledenAlles" :key="index">
                <v-list-item-content
                  v-for="(lidGegevens, index) in lid.leden"
                  :key="index"
                >
                  <v-list-item-title>{{ lidGegevens.naam }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    lidGegevens.lidId
                  }}</v-list-item-subtitle>
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
        <v-btn
          @click="inschrijven"
          :loading="laden"
          :disabled="geselecteerd.length == 0"
          v-if="gebruiker.ouder"
          text
          color="primary"
          >Inschrijving vervolledigen
        </v-btn>
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
              <v-list-item-subtitle
                >{{ `€ ${teBetalen.toFixed(2)}` }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-card-text class="text-center"
          >Gelieve deze betaling zo snel mogelijk in orde te brengen.
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="gekopieerd">
      Betalingsnummer gekopierd
    </v-snackbar>
  </div>
</template>

<script>
import { db, storage } from '@/plugins/firebase'

export default {
  data() {
    return {
      uitstap: {
        dates: []
      },
      ledenAlles: [],
      laden: false,
      betalen: false,
      teBetalen: 0,
      betalingsId: '',
      lidIds: [],
      gekopieerd: false
    }
  },
  computed: {
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
  },
  methods: {
    kopierNummer(betalingsnummer) {
      navigator.clipboard.writeText(betalingsnummer).then(() => {
        this.gekopieerd = true
      })
    },
    inschrijven() {
      this.laden = true
      const ref = db
        .collection('uitstap')
        .doc(this.uitstap.id)
        .collection('betaling')
        .doc()
      ref
        .set({ leden: this.geselecteerd })
        .then((doc) => {
          db.collection('uitstap')
            .doc(this.uitstap.id)
            .collection('betaling')
            .onSnapshot((snapshot) => {
              snapshot.docChanges().forEach((change) => {
                if (change.type === 'modified') {
                  this.teBetalen = change.doc.data().bedrag
                  this.betalingsId = change.doc.data().betalingsnummer
                  this.laden = false
                  this.betalen = true
                }
              })
            })
        })
        .catch((err) => console.log(err))
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
              console.log(url)
              this.uitstap = { ...doc.data(), url, id: doc.id }
            })
            .catch(function(error) {
              console.log(error)
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
                    console.log(inschrijvingen.docs)
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
    }
  }
}
</script>

<style>
.groep {
  margin: 8px;
}
</style>
