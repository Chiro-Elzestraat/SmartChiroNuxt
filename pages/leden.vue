<template>
  <div>
    <v-toolbar flat color="primary" dark>
      <v-toolbar-title>Overzicht leden</v-toolbar-title>
    </v-toolbar>
    <v-tabs
      :vertical="!this.$device.isMobile"
      :show-arrows="this.$device.isMobile"
    >
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
                <v-expansion-panel-header
                  >{{ lid.naam }} <v-spacer />
                  {{
                    new Date(lid.geboortedatum).toLocaleDateString('nl-NL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  }}</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <LidInfo :lid="lid" />
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
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
      ]
    }
  },
  mounted() {
    db.collection('leden')
      .get()
      .then((snapshot) => {
        const leden = []
        snapshot.forEach((doc) => leden.push({ ...doc.data(), lidId: doc.id }))
        const vandaag = new Date()
        const maand = vandaag.getMonth()
        const vergelijkDatum =
          maand < 0
            ? new Date(vandaag.getFullYear() - 1, 0, 0)
            : new Date(vandaag.getFullYear(), 0, 0)
        this.groepen.forEach((groep) => {
          /* misschien deze loop omdraaien, dat eerst over de leden wordt geloopt, en daarna
          pas over de groepen om deze in de juiste groep te plaatsen, ik denk dat dat
          efficiënter is, maar nog niet zeker */
          for (const lid of leden) {
            const leeftijd =
              (vergelijkDatum - new Date(lid.geboortedatum)) /
              (1000 * 3600 * 24 * 365)
            console.log(leeftijd)
            if (leeftijd <= groep.maxLeeftijd && leeftijd > groep.minLeeftijd) {
              groep.leden.push(lid)
              continue
            }
          }
        })
      })
      .catch((err) => {
        console.log(err)
        if (this.$store.state.gebruiker.user.isLoggedIn) this.$router.push('/')
      })
    // const getAlleLeden = functions.httpsCallable('getAlleLeden') // TODO: rechtsreekse call naar database, zodat offline functionaliteit van firestore kan worden benut
    // getAlleLeden().then((result) => {
    //   if (
    //     result.data.error === 'unauthorized' &&
    //     this.$store.state.gebruiker.user.isLoggedIn
    //   ) {
    //     this.$router.push('/')
    //   } else {
    //     const vandaag = new Date()
    //     const maand = vandaag.getMonth()
    //     const vergelijkDatum =
    //       maand < 9
    //         ? new Date(vandaag.getFullYear() - 1, 9, 0)
    //         : new Date(vandaag.getFullYear(), 9, 0)
    //     this.groepen.forEach((groep) => {
    //       /* misschien deze loop omdraaien, dat eerst over de leden wordt geloopt, en daarna
    //       pas over de groepen om deze in de juiste groep te plaatsen, ik denk dat dat
    //       efficiënter is, maar nog niet zeker */
    //       for (const lid of result.data) {
    //         const leeftijd =
    //           (vergelijkDatum - new Date(lid.geboortedatum)) /
    //           (1000 * 3600 * 24 * 365)
    //         console.log(leeftijd)
    //         if (leeftijd <= groep.maxLeeftijd && leeftijd > groep.minLeeftijd) {
    //           groep.leden.push(lid)
    //           continue
    //         }
    //       }
    //     })
    //   }
    // })
  },
  head() {
    return {
      title: 'Leden'
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
