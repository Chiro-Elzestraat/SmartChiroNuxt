<template>
  <div>
    <v-card>
      <div v-if="overgezet">
        <v-card-title>Succesvol overgezet!</v-card-title>
        <v-card-subtitle
          >Wij kijken jouw gegevens na. U hoeft verder niets te doen. Als alles
          klopt, verschijnen jouw leden binnenkort op het dashboard. Vanaf dan
          kan u verder met het beheren van inschrijvingen voor evenementen zoals
          het algemeen weekend of het kamp.</v-card-subtitle
        >
        <v-card-text class="text-center">
          <a @click="$router.push('/')">Terug naar het dashboard</a>
        </v-card-text>
      </div>
      <div v-else>
        <v-card-title>Ledeninformatie overzetten</v-card-title>
        <v-card-subtitle
          >Indien uw leden al waren ingeschreven via het vorige systeem, kan u
          hier de namen ervan opgeven.</v-card-subtitle
        >
        <v-card-text>
          <div v-for="(lid, index) in leden" :key="index">
            <v-row>
              <v-text-field
                v-model="lid.naam"
                :label="`Naam lid ${index + 1}`"
                hint="Voornaam, gevolgd door achternaam"
              ></v-text-field>
              <v-btn style="margin: auto 8px;" @click="verwijderLid(index)"
                >Verwijder</v-btn
              >
            </v-row>
          </div>
          <v-btn @click="voegLidToe" style="margin: 16px;">Voeg lid toe</v-btn
          ><br />
          <div style="width: 100%;">
            <v-btn
              style="margin: 16px auto; display: block;"
              color="primary"
              :loading="laden"
              :disabled="leden.length === 0"
              @click="overzetten"
              >Overzetten</v-btn
            >
          </div>
        </v-card-text>
      </div>
    </v-card>
  </div>
</template>

<script>
import { db } from '@/plugins/firebase'
export default {
  data() {
    return {
      leden: [{ naam: '' }],
      laden: false,
      overgezet: false
    }
  },
  methods: {
    voegLidToe() {
      this.leden.push({ naam: '' })
    },
    verwijderLid(index) {
      this.leden.splice(index, 1)
    },
    overzetten() {
      const leden = this.leden
      this.laden = true
      db.collection('overzetten')
        .doc()
        .set({ leden, ouderId: this.$store.state.gebruiker.user.data.uid })
        .then(() => {
          this.laden = false
          this.overgezet = true
        })
        .catch((err) => console.error(err))
    }
  }
}
</script>

<style></style>
