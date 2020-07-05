<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" dark icon style="margin: 16px;"
        ><v-icon color="primary">mdi-account-edit</v-icon></v-btn
      >
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn @click="dialog = false" icon dark>
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-toolbar-title>{{ lid.naam }}</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn @click="opslaan" :loading="laden" dark text>Opslaan</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-list three-line subheader class="text-center">
        <v-list-item>
          <v-row>
            <v-col>
              <v-text-field v-model="lid.naam" label="Naam"></v-text-field>
            </v-col>
          </v-row>
        </v-list-item>
        <v-subheader>Contact</v-subheader>
        <h1 class="headline">Ouders</h1>
        <v-list-item v-for="(ouder, index) in lid.contact.ouders" :key="index">
          <v-row class="mb-6">
            <v-col cols="12" md="4">
              <v-text-field v-model="ouder.naam" label="Naam"></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="ouder.email" label="E-mail"></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="ouder.gsm" label="Gsm"></v-text-field>
            </v-col>
          </v-row>
        </v-list-item>
        <h1 class="headline">Extra contactpersonen</h1>
        <v-list-item
          v-for="(extra, index) in lid.contact.extra"
          :key="`extra${index}`"
        >
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field v-model="extra.naam" label="Naam"></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="extra.relatie"
                label="Relatie met deze persoon"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="extra.gsm" label="Gsm"></v-text-field>
            </v-col>
          </v-row>
        </v-list-item>
        <h1 class="headline">Huisarts</h1>
        <v-list-item>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="lid.contact.huisarts.naam"
                label="Naam"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="lid.contact.huisarts.gsm"
                label="Gsm"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-list-item>
        <v-subheader>Adres</v-subheader>
        <v-list-item>
          <v-row>
            <v-col cols="12" md="6"
              ><v-text-field v-model="lid.adres.plaats" label="Plaats"
            /></v-col>
            <v-col cols="12" md="6"
              ><v-text-field v-model="lid.adres.postcode" label="Postcode"
            /></v-col>
            <v-col cols="12" md="6"
              ><v-text-field v-model="lid.adres.straat" label="Straat"
            /></v-col>
            <v-col cols="12" md="6"
              ><v-text-field v-model="lid.adres.huisnummer" label="Huisnummer"
            /></v-col>
          </v-row>
        </v-list-item>
      </v-list>
    </v-card>
    <v-snackbar v-model="opgeslagen" color="success" top>Opgeslagen</v-snackbar>
  </v-dialog>
</template>

<script>
import { db } from '@/plugins/firebase'
export default {
  props: {
    lidProp: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialog: false,
      laden: false,
      opgeslagen: false
    }
  },
  computed: {
    lid() {
      const { lidId, ...lid } = this.lidProp // Hiermee wordt lidId uit het object "lidProp" gefilterd.
      // De reden om dit te filteren, is omdat we dit gegeven niet willen opslagen in de database als waarde (dit is immers al het id van het document waarin het is opgeslagen)
      // Uitleg van hoe de filtering werkt: https://stackoverflow.com/a/45898081
      return lid
    }
  },
  methods: {
    opslaan() {
      this.laden = true
      db.collection('leden')
        .doc(this.lidProp.lidId)
        .set(this.lid)
        .then(() => {
          this.opgeslagen = true
          this.laden = false
        })
        .catch((err) => console.log(err))
    }
  }
}
</script>

<style>
.contact {
  margin: 16px;
  width: 100%;
}
v-text-field {
  margin: 8px;
}
</style>
