<template>
  <v-container>
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
      <v-tab>Alle inzendingen</v-tab>
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
                <img
                  @click="poging.url = poging.urlFull"
                  :src="poging.url"
                  v-if="poging.metadata.contentType.substr(0, 5) === 'image'"
                  width="300px"
                  alt="Poging afbeelding"
                />
                <video v-else controls width="240">
                  <source
                    :type="poging.metadata.contentType"
                    :src="poging.urlFull"
                  />
                </video>
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
                      ><v-btn @click="afkeuren(index)" text>Ja</v-btn
                      ><v-btn @click="dialog = false" text
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
            Alles beoordeeld.
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item>
        <v-container>
          <v-row>
            <v-col v-for="(poging, index) in alles" :key="index">
              <v-card outlined>
                <v-card-title>{{ poging.titel }}</v-card-title>
                <v-card-subtitle>{{ poging.naam }}</v-card-subtitle>
                <v-card-text>
                  <img
                    v-if="
                      poging.url &&
                        poging.metadata.contentType.substr(0, 5) === 'image'
                    "
                    :src="poging.url"
                    width="300px"
                    alt="Poging afbeelding"
                  />
                  <video
                    v-else-if="
                      poging.urlFull &&
                        poging.metadata.contentType.substr(0, 5) === 'video'
                    "
                    controls
                    width="240"
                  >
                    <source
                      :type="poging.metadata.contentType"
                      :src="poging.urlFull"
                    />
                  </video>
                  <br />
                  {{ poging.afgekeurd ? 'Afgekeurd' : 'Goedgekeurd' }}
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    v-if="
                      poging.url !== poging.urlFull &&
                        poging.metadata.contentType.substr(0, 5) === 'image'
                    "
                    @click="poging.url = poging.urlFull"
                    text
                    >Volledige foto</v-btn
                  >
                  <v-dialog v-model="poging.verplaatsDialog" width="500">
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" text>Archiveer</v-btn>
                    </template>
                    <v-card>
                      <v-card-title>Bevestig verplaatsen</v-card-title>
                      <v-card-text
                        >Weet je zeker dat je deze poging wil verplaatsen naar
                        het archief? Deze actie kan niet ongedaan gemaakt
                        worden.</v-card-text
                      >
                      <v-card-actions>
                        <v-btn @click="verplaatsArchief(index)" text>Ja</v-btn>
                        <v-btn @click="poging.verplaatsDialog = false" text
                          >Nee</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <p class="text-center">
            Vind je een inzending niet? Dan is deze verplaatst naar het
            <a @click="krijgArchief()">archief</a>.
          </p>
          <v-dialog
            v-model="archiefZichtbaar"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <v-card>
              <v-toolbar dark color="primary">
                <v-btn @click="archiefZichtbaar = false" icon dark>
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Archief</v-toolbar-title>
              </v-toolbar>
              <v-container>
                <v-row>
                  <v-col v-for="(poging, index) in archief" :key="index">
                    <img
                      v-if="
                        poging.url &&
                          poging.metadata.contentType.substr(0, 5) === 'image'
                      "
                      :src="poging.url"
                      @click="poging.url = poging.urlFull"
                      width="300px"
                      alt="Poging afbeelding"
                    />
                    <video
                      v-else-if="
                        poging.urlFull &&
                          poging.metadata.contentType.substr(0, 5) === 'video'
                      "
                      controls
                      width="240"
                    >
                      <source
                        :type="poging.metadata.contentType"
                        :src="poging.urlFull"
                      />
                    </video>
                    <v-btn v-else @click="poging.url = poging.urlFull"
                      >Laad afbeelding</v-btn
                    >
                    <br />
                    {{ poging.afgekeurd ? 'Afgekeurd' : 'Goedgekeurd' }}
                  </v-col>
                </v-row>
                <v-btn
                  @click="volgende"
                  v-if="lastVisible"
                  style="margin: 0 auto; display: block;"
                  >Laad volgende</v-btn
                >
              </v-container>
            </v-card>
          </v-dialog>
        </v-container>
      </v-tab-item>
      <v-tab-item>
        <v-container>
          <v-row>
            <v-col
              v-for="(opdracht, index) in opdrachten"
              :key="index"
              cols="12"
              lg="3"
              md="4"
              sm="4"
            >
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
  </v-container>
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
      alles: [],
      dialog: false,
      opgeslagen: false,
      opdrachten: [],
      tab: 0,
      lastVisible: {},
      archief: [],
      archiefZichtbaar: false,
      verplaatsDialog: false
    }
  },
  created() {
    this.haalOp()
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
    },
    verplaatsArchief(index) {
      const ref = this.alles[index].ref
      ref.update({ archief: true }).then(() => {
        this.alles.splice(index, 1)
        this.opgeslagen = true
      })
    },
    krijgArchief() {
      this.archiefZichtbaar = true
      if (this.archief.length === 0) {
        this.haalArchiefOp(db.collectionGroup('ledenVoltooid'))
      }
    },
    volgende() {
      this.haalArchiefOp(
        db.collectionGroup('ledenVoltooid').startAfter(this.lastVisible)
      )
    },
    haalArchiefOp(ref) {
      ref
        .limit(15)
        .get()
        .then((result) => {
          this.lastVisible = result.docs[result.docs.length - 1]
          result.docs.forEach((doc) => {
            let url = ''
            storage
              .ref(`quarantainespel/thumbs/${doc.id}_200x200`)
              .getDownloadURL()
              .then((url1) => {
                url = url1
              })
              .catch()
              .finally(() => {
                const imgRef = storage.ref(`quarantainespel/${doc.id}`)
                imgRef.getDownloadURL().then((urlFull) => {
                  imgRef.getMetadata().then((metadata) => {
                    this.archief.push({
                      ...doc.data(),
                      url,
                      urlFull,
                      ref: doc.ref,
                      titel: doc.data().naam,
                      metadata
                    })
                  })
                })
              })
          })
        })
    },
    haalOp() {
      db.collection('opdrachten')
        .get()
        .then((result) => {
          this.lastVisible = result.docs[result.docs.length - 1]
          result.docs.forEach((doc) => {
            this.opdrachten.push(doc.data())
            doc.ref
              .collection('ledenVoltooid')
              .where('archief', '==', false)
              .get()
              .then((snapshot) => {
                console.log(snapshot)
                snapshot.forEach((doc1) => {
                  let url = ''
                  storage
                    .ref(`quarantainespel/thumbs/${doc1.id}_200x200`)
                    .getDownloadURL()
                    .then((url1) => {
                      url = url1
                    })
                    .catch()
                    .finally(() => {
                      const imgRef = storage.ref(`quarantainespel/${doc1.id}`)
                      imgRef.getDownloadURL().then((urlFull) => {
                        imgRef.getMetadata().then((metadata) => {
                          if (!doc1.data().bevestigd) {
                            this.teBevestigen.push({
                              ...doc1.data(),
                              url,
                              urlFull,
                              ref: doc1.ref,
                              titel: doc.data().naam,
                              metadata
                            })
                          } else {
                            this.alles.push({
                              ...doc1.data(),
                              url,
                              urlFull,
                              ref: doc1.ref,
                              titel: doc.data().naam,
                              metadata,
                              verplaatsDialog: false
                            })
                          }
                        })
                      })
                    })
                })
              })
          })
        })
    }
  }
}
</script>

<style></style>
