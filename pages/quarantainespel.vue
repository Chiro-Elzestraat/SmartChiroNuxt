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
    <v-row>
      <v-col v-for="(poging, index) in teBevestigen" :key="index">
        <v-card>
          <v-card-title>{{ poging.naam }}</v-card-title>
          <v-card-subtitle></v-card-subtitle>
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
    </v-row>
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
      teBevestigen: [], // oke voor een reden heb ik geen toegang tot de database.... HOE KAN DA er staat letterlijk allow read, write: if true;
      dialog: false,
      opgeslagen: false
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
    db.collectionGroup('ledenVoltooid')
      .where('bevestigd', '==', false)
      .get()
      .then((snapshot) => {
        console.log(snapshot)
        snapshot.forEach((doc) => {
          storage
            .ref(`quarantainespel/${doc.id}`)
            .getDownloadURL()
            .then((url) => {
              this.teBevestigen.push({ ...doc.data(), url, ref: doc.ref })
            })
        })
      })
  }
}
</script>

<style></style>
