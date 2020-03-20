<template>
  <div>
    <v-card>
      <v-card-title>Nieuwe opdracht toevoegen</v-card-title>
      <v-card-text
        >Klik op de plus-knop om een nieuwe opdracht toe te voegen</v-card-text
      >
      <v-dialog v-model="toevoegen" fullscreen hide-overlay>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" fab color="#64DD17" bottom right absolute>
            <!-- ah das idd echt op die kaart, nice -->
            <v-icon>mdi-plus</v-icon>
            <!-- oke ff teruggegaan want teveel kopiëren is niet goed, dan verliest ge overzicht en weet ge ni waarom da ni werkt -->
          </v-btn>
        </template>
        <v-card>
          <v-toolbar dark color="#64DD17">
            <v-btn @click="toevoegen = false" icon dark>
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Nieuwe opdracht toevoegen</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn @click="aanmaken" text>Aanmaken</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-list three-line subheader>
            <v-list-item>
              <v-container>
                <v-form autocomplete="off">
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="opdracht.naam"
                        outlined
                        label="Naam"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-textarea
                        v-model="opdracht.omschrijving"
                        outlined
                        label="Omschrijving"
                      >
                      </v-textarea>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <div class="text-center">
                        Aantal punten:
                        <v-rating
                          v-model="opdracht.punten"
                          length="3"
                        ></v-rating>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-checkbox
                        v-model="opdracht.video"
                        label="Video"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-list-item>
          </v-list>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
import { db } from '@/plugins/firebase'
export default {
  data() {
    return {
      toevoegen: false,
      opdracht: {
        naam: '',
        omschrijving: '',
        punten: 1
      }
    }
  },
  methods: {
    aanmaken() {
      db.collection('opdrachten')
        .add(this.opdracht)
        .then(() => {
          this.toevoegen = false
          this.opdracht = {
            naam: '',
            omschrijving: '',
            punten: 1
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>
