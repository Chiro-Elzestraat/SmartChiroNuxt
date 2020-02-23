<template>
  <v-card>
    <v-toolbar dark color="primary">
      <v-btn icon dark @click="$emit('sluit')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Nieuwe activiteit</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn dark text @click="aanmaken">Aanmaken</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-list three-line subheader>
      <v-subheader>Informatie uitstap</v-subheader>
      <v-list-item>
        <v-container>
          <form autocomplete="off">
            <v-row>
              <v-col>
                <v-text-field
                  label="Titel"
                  v-model="uitstap.titel"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-textarea
                  label="Beschrijving"
                  outlined
                  v-model="uitstap.beschrijving"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
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
                  label="Afbeelding"
                  id="afbeelding"
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
                hint="Voor 1-daagse uitstappen, druk 2 keer op de begindatum."
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
              class="mt-4"
              locale="nl"
              first-day-of-week="1"
              :min="new Date().toLocaleDateString('en-US')"
              :max="
                uitstap.dates[0]
                  ? uitstap.dates[0]
                  : new Date().toLocaleDateString('en-US')
              "
            ></v-date-picker>
          </v-row>
          <v-row>
            <v-chip
              class="groep"
              :color="groep.geselecteerd ? 'green' : ''"
              @click="groep.geselecteerd = !groep.geselecteerd"
              v-for="(groep, index) in uitstap.groepen"
              :key="index"
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
    uitstap: {
      dates: [],
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
