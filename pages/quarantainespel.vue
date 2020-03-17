<template>
  <div>
    <h1>Quarantainespel</h1>
    <v-row>
      <v-col>
        <NieuweOpdracht />
      </v-col>
    </v-row>
    <br />
    <br />
    <v-tabs v-model="tab">
      <v-tab>Te beoordelen</v-tab>
      <v-tab>Opdrachten</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-row>
          <v-col v-for="(poging, index) in teBevestigen" :key="index">
            <v-card>
              <v-card-title>{{ poging.titel }}</v-card-title>
              <v-card-subtitle>{{ poging.naam }}</v-card-subtitle>
              <v-card-text>
                <img :src="poging.url" width="300px" alt="Poging afbeelding" />
              </v-card-text>
              <v-card-actions>
                <v-btn @click="goedkeuren(index)" color="#64DD17" text
                  >Goedkeuren</v-btn
                >
                <v-dialog v-model="dialog">
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" color="primary" text>Afkeuren</v-btn>
                  </template>
                  <v-card>
                    <v-card-title>Opgelet</v-card-title>
                    <v-card-subtitle
                      >Zeker dat je deze poging wilt afkeuren?</v-card-subtitle
                    >
                    <v-card-actions
                      ><v-btn text @click="afkeuren(index)">Ja</v-btn
                      ><v-btn text @click="dialog = false"
                        >Nee</v-btn
                      ></v-card-actions
                    >
                  </v-card>
                </v-dialog>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col v-if="teBevestigen.length === 0" class="text-center">
            <img
              src="../assets/geenleden.svg"
              style="display: block;
  margin: 0 auto;
  max-width: 40%;"
            />
            Nog geen pogingen ingestuurd.
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item>
        <v-container>
          <v-row>
            <v-col cols="12" lg="3" md="4" sm="4" v-for="(opdracht, index) in opdrachten" :key="index">
              <v-card outlined>
                <v-card-title>{{ opdracht.naam }}</v-card-title>
                <v-card-subtitle>{{ opdracht.omschrijving }}</v-card-subtitle>
                <v-card-text>Aantal punten: {{ opdracht.punten }}</v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs-items>
    <v-snackbar v-model="opgeslagen">Opgeslagen</v-snackbar>
  </div>
</template>

<script>
import NieuweOpdracht from '@/components/NieuweOpdracht'
import { db, storage } from '@/plugins/firebase'
export default {
  components: {
    NieuweOpdracht
  },
  data() {
    return {
      teBevestigen: [],
      dialog: false,
      opgeslagen: false,
      opdrachten: [],
      tab: 0
    }
  },
  methods: {
    goedkeuren(index) {
      const ref = this.teBevestigen[index].ref
      ref.update({ bevestigd: true }).then(() => {
        this.teBevestigen.splice(index, 1)
        this.opgeslagen = true
      })
    },
    afkeuren(index) {
      const ref = this.teBevestigen[index].ref
      ref.update({ bevestigd: true, afgekeurd: true }).then(() => {
        this.teBevestigen.splice(index, 1)
        this.dialog = false
        this.opgeslagen = true
      })
    }
  },
  created() {
    db.collection('opdrachten')
      .get()
      .then((result) => {
        result.docs.forEach((doc) => {
          this.opdrachten.push(doc.data())
          doc.ref
            .collection('ledenVoltooid')
            .where('bevestigd', '==', false)
            .get()
            .then((snapshot) => {
              console.log(snapshot)
              snapshot.forEach((doc1) => {
                storage
                  .ref(`quarantainespel/${doc1.id}`)
                  .getDownloadURL()
                  .then((url) => {
                    this.teBevestigen.push({
                      ...doc1.data(),
                      url,
                      ref: doc1.ref,
                      titel: doc.data().naam
                    })
                  })
              })
            })
        })
      })
  }
}
</script>

<style></style>
