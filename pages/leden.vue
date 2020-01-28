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
            <v-expansion-panels focusable>
              <v-expansion-panel v-for="(lid, i) in groep.leden || 0" :key="i">
                <v-expansion-panel-header
                  >{{ lid.naam }} |
                  {{ lid.geboortedatum }}</v-expansion-panel-header
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
import firebase from 'firebase'
import LidInfo from '../components/LidInfo'
export default {
  components: {
    LidInfo
  },
  data() {
    return {
      leden: []
    }
  },
  computed: {
    groepen() {
      // TODO: deze groepen kunnen ook opgehaald worden van server
      const groepen = [
        { naam: 'Speelclub', leden: [], minLeeftijd: 4, maxLeeftijd: 8 },
        { naam: 'Rakkers', leden: [], minLeeftijd: 8, maxLeeftijd: 10 },
        { naam: 'Toppers', leden: [], minLeeftijd: 10, maxLeeftijd: 14 },
        { naam: 'Kerels', leden: [], minLeeftijd: 14, maxLeeftijd: 16 },
        { naam: `Aspi's`, leden: [], minLeeftijd: 16, maxLeeftijd: 18 }
      ]
      const vandaag = new Date()
      const maand = vandaag.getMonth()
      const vergelijkDatum =
        maand < 9
          ? new Date(vandaag.getFullYear() - 1, 9, 0)
          : new Date(vandaag.getFullYear(), 9, 0)
      groepen.forEach((groep) => {
        /* nog wel zoeken ofdat dit niet kan geoptimaliseerd worden, momenteel loopt die 
        voor elke groep over élk lid, ook al is die al in de juiste groep geplaatst,
        dus mss een tweede lijstje ofzo maken? */
        this.leden.forEach((lid) => {
          const leeftijd =
            (vergelijkDatum - new Date(lid.geboortedatum)) /
            (1000 * 3600 * 24 * 365)
          console.log(leeftijd)
          if (leeftijd <= groep.maxLeeftijd && leeftijd > groep.minLeeftijd) {
            console.log(lid)
            groep.leden.push(lid)
          }
        })
      })
      return groepen
    }
  },
  mounted() {
    const getAlleLeden = firebase.functions().httpsCallable('getAlleLeden') // TODO: rechtsreekse call naar database, zodat offline functionaliteit van firestore kan worden benut
    getAlleLeden().then((result) => {
      if (
        result.data.error === 'unauthorized' &&
        this.$store.state.gebruiker.user.isLoggedIn
      ) {
        this.$router.push('/')
      }
      this.leden = result.data
    })
  }
}
</script>

<style>
.contact {
  display: flex;
  flex-wrap: wrap;
}
.contactpersoon {
  margin: 16px auto;
}
@media (orientation: landscape) {
  .vtab {
    width: 200px;
  }
}
</style>
