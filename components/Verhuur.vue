<template>
  <v-card>
    <v-toolbar dark color="primary">
      <v-btn icon dark @click="$emit('sluit')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Nieuwe aanvraag</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn dark text @click="aanmaken">Aanmaken</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-list three-line subheader>
      <v-subheader>Informatie huurder</v-subheader>
      <v-list-item>
        <v-container>
          <form autocomplete="off">
            <v-row>
              <v-col>
                <v-text-field
                  label="Vereniging"
                  v-model="verhuur.huurder.vereniging"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  label="Naam huurder"
                  v-model="verhuur.huurder.naam"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  label="Gsm huurder"
                  v-model="verhuur.huurder.gsm"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-textarea
                  label="Opmerking"
                  outlined
                  v-model="verhuur.opmerking"
                ></v-textarea>
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
                v-model="verhuur.dates"
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
    <v-dialog v-model="klaar" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Gelukt</v-card-title>
        <v-card-text></v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary" text @click="terug()">
            Terug
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { db } from '@/plugins/firebase'

const initialState = () => {
  return{
    verhuur: {
        huurder: { naam: '', gsm: '', vereniging: '' },
        dates: [],
        opmerking: ''
      },
      klaar: false
  }
}

export default {
  data() {
    return initialState()
  },
  computed: {
    dateRangeText() {
      return this.verhuur.dates.join(' t.e.m. ')
    }
  },
  methods: {
    terug(){
      Object.assign(this.$data, initialState())
      this.$emit('terug')
    },
    aanmaken() {
      db.collection('verhuur')
        .add({
          ...this.verhuur,
          uid: this.$store.state.gebruiker.user.data.uid
        })
        .then(() => {
          this.klaar = true
        })
        .catch((err) => {
          console.log(err)
        })
    }
    // const file = document.getElementById('afbeelding').files[0]
    // const doc = db.collection('verhuur').doc()
    // doc.set(this.verhuur).then(() => {
  }
}
</script>

<style></style>
