<template>
    <v-container>
        <h1><v-badge content="Beta">Verhuur</v-badge></h1>
        <v-dialog v-model="nieuweBoekingDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
          <template v-slot:activator="{on}">
            <v-btn v-on="on" fab fixed bottom right color="primary"><v-icon>mdi-plus</v-icon></v-btn>
          </template>
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn @click="nieuweBoekingDialog = false" icon dark><v-icon>mdi-close</v-icon></v-btn>
              <v-spacer/>
              <v-btn @click="voegVerhuurToe" text>Toevoegen</v-btn>
            </v-toolbar>
            <v-container>
             <v-row>
               <v-col cols xs="12" sm="12" md="8">
                 <v-text-field v-model="boeking.huurder.vereniging" label="Vereniging"/>
                 <v-text-field v-model="boeking.huurder.naam" label="Naam"/>
                 <v-text-field v-model="boeking.huurder.email" label="Email"/>
                 <v-text-field v-model="boeking.huurder.gsm" label="GSM"/>
                 <v-row>
                   <v-col cols="auto">
                     <v-checkbox v-model="boeking.huurder.contractInOrde" label="Contract in orde"></v-checkbox>
                   </v-col>
                   <v-col cols="auto">
                     <v-checkbox v-model="boeking.huurder.waarborgInOrde" label="Waarborg in orde"></v-checkbox>
                   </v-col>
                 </v-row>
               </v-col>
               <v-col cols xs="12" sm="12" md="auto"><v-date-picker v-model="boeking.dates" range></v-date-picker></v-col>
             </v-row>
              <v-textarea v-model="boeking.opmerking" label="Opmerking" />
              <v-menu
                v-model="datumInput"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="boeking.datumAanvraag"
                    v-bind="attrs"
                    v-on="on"
                    label="Datum van aanvraag"
                    prepend-icon="mdi-calendar"
                    readonly
                  ></v-text-field>
                </template>
                <v-date-picker v-model="boeking.datumAanvraag" @input="datumInput = false"></v-date-picker>
              </v-menu>
            </v-container>
          </v-card>
        </v-dialog>
      <v-btn @click="prev" fab text>
        <v-icon small>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn @click="start = ''" :disabled="start === ''" text>
        Vandaag
      </v-btn>
      <v-btn @click="next" fab text>
        <v-icon small>mdi-chevron-right</v-icon>
      </v-btn>
      <v-calendar
        ref="calendar"
        v-model="start"
        :events="events"
        @click:event="showEvent"
        color="primary"
        type="month"
      ></v-calendar>
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
      >
        <v-card
          min-width="350px"
          flat
        >
          <v-toolbar
            color="primary"
            dark
          >
            <v-toolbar-title>{{selectedEvent.huurder ? selectedEvent.huurder.vereniging : ""}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn v-if="bewerken" @click="opslaan" icon>
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
            <v-btn @click="toggleBewerken" icon>
              <v-icon>{{bewerken ? 'mdi-close' : 'mdi-pencil'}}</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text style="height: 300px; overflow:auto;">
            <v-progress-circular v-if="infoLaden" indeterminate color="primary"/>
            <v-form v-if="selectedEvent.huurder" :disabled="!bewerken">
              <v-row>
                <v-col class="py-0"><v-checkbox v-model="selectedEvent.huurder.contractInOrde" class="shrink mr-0 mt-0" label="Contract in orde"/></v-col>
              </v-row>
              <v-row>
                <v-col class="py-0"><v-checkbox v-model="selectedEvent.huurder.waarborgInOrde" class="shrink mr-0 mt-0" label="Waarborg in orde"/></v-col>
              </v-row>
              <v-row>
                <v-col class="py-0"><v-text-field v-model="selectedEvent.huurder.vereniging" label="Vereniging"></v-text-field></v-col>
              </v-row>
              <v-row align="center">
                <v-col class="py-0"><v-text-field v-model="selectedEvent.huurder.email" label="Email"></v-text-field></v-col>
                <v-col class="py-0" cols="auto"><a :href="`mailto:${selectedEvent.huurder.email}`"><v-icon>mdi-email</v-icon></a></v-col>
              </v-row>
              <v-row align="center">
                <v-col class="py-0"><v-text-field v-model="selectedEvent.huurder.gsm" label="GSM"></v-text-field></v-col>
                <v-col class="py-0" cols="auto"><a :href="`tel:${selectedEvent.huurder.gsm}`"><v-icon>mdi-phone</v-icon></a></v-col>
              </v-row>
              <v-row>
                <v-col class="py-0"><v-text-field v-model="selectedEvent.huurder.naam" label="Naam"></v-text-field></v-col>
              </v-row>
              <v-row>
                <v-col class="py-0"><v-textarea v-model="selectedEvent.huurder.opmerking" label="Opmerking"></v-textarea></v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              @click="selectedOpen = false"
              text
              color="secondary"
            >
              Sluiten
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-container>
</template>

<script>
  import { db } from '@/plugins/firebase'
export default {
  data() {
    return {
      bewerken: false,
      infoLaden: false,
      selectedEvent: {},
      selectedEventBackup: {},
      selectedElement: null,
      selectedOpen: false,
      start: '',
      nieuweBoekingDialog: false,
      datumInput: false,
      boeking: {
        datumAanvraag: '',
        dates: [],
        huurder: {
          contractInOrde: false,
          waarborgInOrde: false,
          gsm: '',
          naam: '',
          vereniging: '',
        },
        opmerking: '',
      },
      opkomendeVerhuur: []
    }
  },
  computed: {
    beginDatum() {
      if(this.gesorteerdeDatums.length > 0)
        return this.gesorteerdeDatums[0]
      return 0
    },
    eindDatum(){
      if(this.gesorteerdeDatums.length > 1)
        return this.gesorteerdeDatums[1]
      return 0
    },
    gesorteerdeDatums(){
      const dates = this.boeking.dates
      return dates.sort((a, b) => new Date(a).getTime()-new Date(b).getTime())
    },
    events(){
      const events = []
       this.opkomendeVerhuur.forEach(verhuur => {
         console.log(verhuur)
         if(verhuur.beginDatum)
           events.push({id: verhuur.id, name: 'Verhuurd', start: new Date(verhuur.beginDatum.seconds * 1000), end: new Date(verhuur.eindDatum.seconds * 1000)})
       })
      if(events.length > 0)
        return events
      return []
      }
  },
  created() {
    db.collection('verhuur').where('eindDatum', '>', new Date(new Date().setDate(new Date().getDate() - 1))).get().then(querySnapshot => {
      querySnapshot.forEach(doc =>{
        this.opkomendeVerhuur.push({...doc.data(), id: doc.id})
      })
    })
  },
  mounted() {
    this.$refs.calendar.checkChange()
  },
  methods: {
    opslaan(){
      db.collection('verhuur').doc(this.selectedEvent.id).collection('huurder').doc('info').update({...this.selectedEvent.huurder}).then(() => {
        this.bewerken = false
      }
      )
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.infoLaden = true
        db.collection('verhuur').doc(event.id).collection('huurder').doc('info').get().then(doc => {
          this.selectedEvent.huurder = doc.data()
          this.infoLaden = false
        })
        this.selectedElement = nativeEvent.target
        setTimeout(() => {this.selectedOpen = true}, 10)
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    toggleBewerken(){
      if(!this.bewerken)
        this.selectedEventBackup = {...this.selectedEvent.huurder}
      else
        this.selectedEvent.huurder = {...this.selectedEventBackup}
      this.bewerken = !this.bewerken
    },
    voegVerhuurToe() {
      db.collection('verhuur').add({datumAanvraag: new Date(this.boeking.datumAanvraag), beginDatum: new Date(this.beginDatum), eindDatum: new Date(this.eindDatum)}).then(ref => {
        ref.collection('huurder').doc('info').set({...this.boeking.huurder, opmerking: this.boeking.opmerking}).then(() => {
          this.nieuweBoekingDialog = false
        })
      })
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
  }
}
</script>
