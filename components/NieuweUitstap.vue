<template>
  <v-card>
    <v-toolbar dark color="primary">
      <v-btn @click="$emit('sluit')" icon dark>
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Nieuwe activiteit</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn @click="aanmaken" dark text>Aanmaken</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-list three-line subheader>
      <v-subheader>Informatie uitstap</v-subheader>
      <v-list-item>
        <v-container>
          <form autocomplete="off">
            <v-row>
              <v-col><v-checkbox label="Is kamp" v-model="isKamp"/></v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="uitstap.titel"
                  label="Titel"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-textarea
                  v-model="uitstap.beschrijving"
                  label="Beschrijving"
                  outlined
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row v-if="uitstap.isKamp">
              <v-col>
                <v-switch label="Geef korting vanaf 3de lid" v-model="uitstap.geefKorting"></v-switch>
              </v-col>
            </v-row>
            <v-row>
              <v-col v-if="uitstap.isKamp">
                <v-text-field
                  v-model="uitstap.kostprijsSpeelclub"
                  label="Kostprijs speelclub"
                  outlined
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="uitstap.kostprijs"
                  label="Kostprijs"
                  outlined
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-file-input
                  id="afbeelding"
                  label="Afbeelding"
                  filled
                  prepend-icon="mdi-camera"
                ></v-file-input>
              </v-col>
            </v-row>
          </form>
        </v-container>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list three-line subheader>
      <v-subheader>Datums</v-subheader>
      <v-list-item>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6">
              <v-date-picker
                v-model="uitstap.dates"
                range
                locale="nl"
                first-day-of-week="1"
              ></v-date-picker>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="dateRangeText"
                label="Begin en einddatum"
                :hint="uitstap.isKamp ? '' : 'Voor 1-daagse uitstappen, druk 2 keer op de begindatum.'"
                persistent-hint
                prepend-icon="mdi-event"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="uitstap.isKamp">
            <v-col cols="12" sm="6">
              <v-date-picker
                v-model="uitstap.datesSpeelclub"
                range
                locale="nl"
                first-day-of-week="1"
              ></v-date-picker>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="dateRangeTextSpeelclub"
                label="Begin en einddatum speelclub"
                persistent-hint
                prepend-icon="mdi-event"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center">
            <h1 class="headline">
              Deadline inschrijven
            </h1>
          </v-row>
          <v-row justify="center">
            <v-date-picker
              v-model="uitstap.deadline"
              :min="new Date().toISOString()"
              :max="
                uitstap.dates[0] ? uitstap.dates[0] : new Date().toISOString()
              "
              class="mt-4"
              locale="nl"
              first-day-of-week="1"
            ></v-date-picker>
          </v-row>
          <v-row>
            <v-chip
              :color="groep.geselecteerd ? 'green' : ''"
              @click="groep.geselecteerd = !groep.geselecteerd"
              v-for="(groep, index) in uitstap.groepen"
              :key="index"
              class="groep"
              >{{ groep.naam }}</v-chip
            >
          </v-row>
        </v-container>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <!-- <v-list three-line subheader>
          <v-subheader>General</v-subheader>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox v-model="notifications"></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Notifications</v-list-item-title>
              <v-list-item-subtitle
                >Notify me about updates to apps or games that I
                downloaded</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox v-model="sound"></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Sound</v-list-item-title>
              <v-list-item-subtitle
                >Auto-update apps at any time. Data charges may
                apply</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox v-model="widgets"></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Auto-add widgets</v-list-item-title>
              <v-list-item-subtitle
                >Automatically add home screen widgets</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-list> -->
  </v-card>
</template>

<script>
import { db, storage } from '@/plugins/firebase'
const initialState = () => {
  return {
    isKamp: false,
    uitstap: {
      isKamp: false,
      dates: [],
      datesSpeelclub: [],
      geefKorting: false,
      groepen: [
        { naam: 'Speelclub', geselecteerd: false },
        { naam: 'Rakkers', geselecteerd: false },
        { naam: 'Toppers', geselecteerd: false },
        { naam: 'Kerels', geselecteerd: false },
        { naam: `Aspiranten`, geselecteerd: false }
      ]
    }
  }
}
export default {
  data() {
    return initialState()
  },
  computed: {
    dateRangeText() {
      return this.uitstap.dates.join(' t.e.m. ')
    },
    dateRangeTextSpeelclub(){
      return this.uitstap.datesSpeelclub.join(' t.e.m. ')
    },
  },
  watch: {
    isKamp(newValue, oldValue) {
      this.uitstap.isKamp = newValue
      if(newValue)
        this.uitstap.groepen = this.uitstap.groepen.map(g => {return {...g, geselecteerd: true}})
    }
  },
  methods: {
    aanmaken() {
      const file = document.getElementById('afbeelding').files[0]
      const doc = db.collection('uitstap').doc()
      doc.set(this.uitstap).then(() => {
        storage
          .ref()
          .child(`uitstap/${doc.id}`)
          .put(file)
          .then((snap) => {
            document.getElementById('afbeelding').value = ''
            Object.assign(this.$data, initialState())
            this.$emit('aangemaakt')
          })
      })
    }
  }
}
</script>

<style></style>
