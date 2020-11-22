<template>
  <v-container>
    <v-toolbar flat color="primary" dark>
      <v-toolbar-title>Overzicht leden</v-toolbar-title>
      <div class="mt-8 ml-10">
        <v-col cols xs="8" sm="8" md="8">
        <v-select
        @change="vraagLedenOp"
      v-model="geselecteerdJaar"
      :items="selectJaren"
      outlined
      ></v-select>
      </v-col>
      </div>
      <v-spacer />
      <v-btn @click="krijgMails"><v-icon>mdi-content-copy</v-icon> mails</v-btn>
    </v-toolbar>
    <v-tabs :vertical="!this.$device.isMobile" :show-arrows="this.$device.isMobile">
      <v-tab v-for="(groep, i) in groepen" :key="i" class="vtab">
        <!-- <v-icon left>mdi-account</v-icon> -->
        {{ groep.naam }}
        <v-spacer />
        {{ groep.leden.length }}
      </v-tab>
      <v-tab-item v-for="(groep, i) in groepen" :key="i">
        <v-card flat>
          <v-card-text>
            <v-expansion-panels focusable popout>
              <v-expansion-panel v-for="(lid, i) in groep.leden || 0" :key="i">
                <v-expansion-panel-header :color="lid.betaald ? '' : 'red'">
                  <v-badge icon="mdi-alert" left v-if="lid.waarschuwing">{{ lid.naam }}</v-badge>
                  <div v-else>{{lid.naam}}</div>
                  <v-spacer />
                  {{
                  new Date(lid.geboortedatum).toLocaleDateString('nl-NL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                  })
                  }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <LidInfo :lid="lid" />
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab class="vtab">
        Leiding
        <v-spacer />
        {{leiders.length}}
      </v-tab>
      <v-tab-item>
        <v-card flat>
          <v-card-title>Overzicht leiding</v-card-title>
          <v-card-text>
            <v-expansion-panels focusable popout>
              <v-expansion-panel v-for="(leider, ii) in leiders" :key="ii">
                <v-expansion-panel-header>{{ leider.naam }}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card><v-card-text>
                    <a :href="'tel:'+ leider.gsm">
                      {{
                      leider.gsm
                      }}
                    </a></v-card-text>
                    <div v-if="leider.adres">
                      <v-card-text>
                        {{ leider.adres.straat }} {{ leider.adres.huisnummer }}
                        {{ leider.adres.bus }} {{ leider.adres.postcode }} {{ leider.adres.plaats }}
                      </v-card-text>
                    </div>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
    <v-snackbar v-model="gekopieerd">Mails van alle ouders gekopierd naar het klembord.</v-snackbar>
  </v-container>
</template>

<script>
import { db } from '../plugins/firebase'
import LidInfo from '../components/LidInfo'
export default {
  components: {
    LidInfo
  },
  data() {
    return {
      // TODO: deze groepen kunnen ook opgehaald worden van server
      groepen: [
        { naam: 'Speelclub', leden: [], minLeeftijd: 0, maxLeeftijd: 9 },
        { naam: 'Rakkers', leden: [], minLeeftijd: 9, maxLeeftijd: 12 },
        { naam: 'Toppers', leden: [], minLeeftijd: 12, maxLeeftijd: 14 },
        { naam: 'Kerels', leden: [], minLeeftijd: 14, maxLeeftijd: 16 },
        { naam: `Aspi's`, leden: [], minLeeftijd: 16, maxLeeftijd: 18 }
      ],
      mails: [],
      leiders: [],
      gekopieerd: false,
      chiroJaar: (new Date().getMonth() < 7 ? -1 : 0) + new Date().getFullYear(),
      geselecteerdJaar: 0,
    }
  },
  mounted() {
    this.geselecteerdJaar = this.chiroJaar
    db.collection('leiders')
      .doc('leidersdoc')
      .get()
      .then((doc) => {
        this.leiders = [...doc.data().leiders]
        console.log(this.leiders)
      })
      this.vraagLedenOp()

  },

  head() {
    return {
      title: 'Leden'
    }
  },
  methods: {
    krijgMails() {
      navigator.clipboard.writeText(this.mails.join(';')).then(() => {
        this.gekopieerd = true
      })
    },
    vraagLedenOp(){
      this.groepen = [
        { naam: 'Speelclub', leden: [], minLeeftijd: 0, maxLeeftijd: 9 },
        { naam: 'Rakkers', leden: [], minLeeftijd: 9, maxLeeftijd: 12 },
        { naam: 'Toppers', leden: [], minLeeftijd: 12, maxLeeftijd: 14 },
        { naam: 'Kerels', leden: [], minLeeftijd: 14, maxLeeftijd: 16 },
        { naam: `Aspi's`, leden: [], minLeeftijd: 16, maxLeeftijd: 18 }
      ]
      const betalingen = db.collectionGroup('betaling').where('jaar', '==', this.geselecteerdJaar)
        betalingen.get().then(async snapshot => {
          const leden = []
          const promises = []
          const lidIds = []
         snapshot.forEach(async doc => {
           if(!lidIds.includes(doc.ref.parent.parent.id)){
             lidIds.push(doc.ref.parent.parent.id)
             const doc2 = doc.ref.parent.parent.get()
             promises.push(doc2)
             const doc1 = await doc2
             leden.push( {...doc1.data(), lidId: doc1.id, betaald: doc.data().betaald})
           }else{
             await Promise.all(promises)
             const index = leden.findIndex(lid => {
               return lid.lidId === doc.ref.parent.parent.id
             })
             console.log(index)
             if(doc.data().betaald){
               leden[index].betaald = true
             }
           leden[index].waarschuwing = true
           }
         })
         await Promise.all(promises)
         const vandaag = new Date()
        const maand = vandaag.getMonth()
        const vergelijkDatum =
          maand < 8
            ? new Date(this.geselecteerdJaar, 8, 0)
            : new Date(vandaag.getFullYear(), 8, 0)
        this.groepen.forEach((groep) => {
          /* misschien deze loop omdraaien, dat eerst over de leden wordt geloopt, en daarna
          pas over de groepen om deze in de juiste groep te plaatsen, ik denk dat dat
          efficiënter is, maar nog niet zeker */
          for (const lid of leden) {
            lid.contact.ouders.forEach((ouder) => {
              if (ouder.email.includes('@')) this.mails.push(ouder.email)
            })
            const chiroLeeftijd = lid.chiroLeeftijd || 0
            const leeftijd =
              (vergelijkDatum - new Date(lid.geboortedatum)) /
                (1000 * 3600 * 24 * 365) +
              chiroLeeftijd

            if (leeftijd <= groep.maxLeeftijd && leeftijd > groep.minLeeftijd) {
              groep.leden.push(lid)
              continue
            }
          }
          this.mails = [...new Set(this.mails)]
        })
        })
      .catch((err) => {
        console.log(err)
        if (this.$store.state.gebruiker.user.isLoggedIn) this.$router.push('/')
      })
    }
  },
  computed: {
    selectJaren(){
    return [this.chiroJaar, this.chiroJaar-1, this.chiroJaar-2]

    }
  }
}
</script>

<style>
@media (orientation: landscape) {
  .vtab {
    width: 200px;
  }
}
</style>
