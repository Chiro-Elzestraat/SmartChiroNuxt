<template>
  <div>
    <OptieDivider
      text="Rollenbeheer"
      icon="mdi-account-multiple"
      class="pa-0"
    />
    <v-row class="text-center">
      <v-col v-for="(rolnaam, index) in rollen.naam" :key="index" cols="4">
        <div @click="haalRolOp(rolnaam)">
          <v-btn fab color="primary">
            <v-icon>{{ rollen.icon[index] }}</v-icon>
          </v-btn>
          <p>{{ rolnaam }}</p>
        </div>
      </v-col>
    </v-row>
    <v-dialog v-model="verwijderDialog" width="500">
      <v-card>
        <v-card-title>Waarschuwing</v-card-title>
        <v-card-text
        >Bent u zeker dat u deze persoon zijn rol als
          {{ huidigeRol }} wilt verwijderen</v-card-text
        >
        <v-card-actions>
          <v-btn @click="deleteRol(huidigGebruikerId)" text>Ja</v-btn>
          <v-btn @click="verwijderDialog = false" text>Nee</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="rolDialog" width="500">
      <v-card>
        <v-card-title>{{ huidigeRol }}</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="gebruiker in gebruikersMetRol"
              :key="gebruiker.uid"
              two-line
            >
              <v-list-item-avatar>
                <v-img :src="gebruiker.photoUrl"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ gebruiker.displayName }}</v-list-item-title>
                <v-list-item-subtitle>{{ gebruiker.uid }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon
                  @click="verwijder(gebruiker.id)"
                  :disabled="
                    $store.state.gebruiker.user.data.uid === gebruiker.uid
                  "
                  >mdi-trash-can-outline</v-icon
                >
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-dialog v-model="voegToeDialog" width="500">
          <template v-slot:activator="{ on }">
            <v-card-actions>
              <v-btn v-on="on" bottom right absolute>
                <v-icon fab>mdi-plus</v-icon>
              </v-btn>
            </v-card-actions>
          </template>
          <v-card>
            <v-card-title>Ken een nieuwe rol aan een gebruiker toe</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="zoekOpdracht"
                @click:append-outer="zoek()"
                @keydown.enter="zoek()"
                label="Naam"
                append-outer-icon="mdi-magnify"
              ></v-text-field>
              <v-list>
                <v-list-item
                  v-for="zoekResultaat in zoekResultaten"
                  :key="zoekResultaat.id"
                  two-line
                >
                  <v-list-item-avatar>
                    <v-img :src="zoekResultaat.photoUrl"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content
                    ><v-list-item-title>{{
                      zoekResultaat.displayName
                    }}</v-list-item-title
                    ><v-list-item-subtitle>{{
                      zoekResultaat.uid
                    }}</v-list-item-subtitle></v-list-item-content
                  >
                  <v-list-item-icon
                    ><v-icon
                      @click="voegRolToe(zoekResultaat)"
                      :disabled="heeftRol(zoekResultaat.uid)"
                      >mdi-plus</v-icon
                    ></v-list-item-icon
                  >
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-card>
    </v-dialog>
  </div>
  <!-- hier maken -->
</template>
<script>
import { db } from '@/plugins/firebase'
import OptieDivider from '@/components/OptieDivider'
export default {
  components: {
    OptieDivider
  },
  data() {
    return {
      rollen: {
        naam: ['Groepsleider', 'Website', 'Kas', 'Verhuur','Secretaris', 'Leider'],
        icon: [
          'mdi-account',
          'mdi-laptop',
          'mdi-cash-register',
          'mdi-home',
          'mdi-account-edit',
          'mdi-whistle'
        ]
      },
      rolDialog: false,
      voegToeDialog: false,
      verwijderDialog: false,
      huidigeRol: '',
      zoekResultaten: [],
      contactLeiders: [],
      zoekOpdracht: '',
      huidigGebruikerId: '',
      leiders: []
    }
  },
  computed: {
    gebruikersMetRol () {
      return this.leiders.filter(leider => leider.customClaims.rollen[this.huidigeRol.toLowerCase()])
    }
  },
  watch: {
    voegToeDialog(newValue, oldValue) {
      this.zoekResultaten = []
      this.zoekOpdracht = ''
    }
  },
  mounted() {
    this.$axios.get('roles').then(result => {
      this.leiders = result.data
    })
  },
  methods: {
    heeftRol(uid){
      return this.leiders.filter(leider => leider.uid === uid).length > 0
    },
    verwijder(id){
      this.huidigGebruikerId = id
      this.verwijderDialog = true
    },
    zoek() {
      this.zoekResultaten = []
      this.$axios.get(`roles/${this.zoekOpdracht}`).then((result) => {this.zoekResultaten = result.data})
    },
    deleteRol(id) {
      const rol = this.huidigeRol.toLowerCase()
      db.collection('gebruikers')
        .doc(id)
        .collection('toegang')
        .limit(1)
        .get()
        .then((docs) => {
          docs.forEach((doc) => {
            const data = doc.data()
            data.heeft = data.heeft.filter((huidigeRol) => huidigeRol !== rol)
            db.collection('gebruikers')
              .doc(id)
              .collection('toegang')
              .doc(doc.id)
              .update(data)
              .then(() => {
                this.verwijderDialog = false
                this.gebruikersMetRol = this.gebruikersMetRol.filter(
                  (gebruiker) => gebruiker.id !== id
                )
                if (rol === 'leider') {
                  db.collection('leiders')
                    .doc('leidersdoc')

                }
              })
          })
        })
    },
    voegRolToe(gebruiker) {
      const rol = this.huidigeRol.toLowerCase()
      if (this.huidigeRol === 'Leider') {
        this.updateContactLeiding(gebruiker)
      }
      db.collection('gebruikers')
        .doc(gebruiker.id)
        .collection('toegang')
        .limit(1)
        .get()
        .then((docs) => {
          docs.forEach((doc) => {
            const data = doc.data()
            data.heeft.push(rol)
            data.heeft = [...new Set(data.heeft)]
            db.collection('gebruikers')
              .doc(gebruiker.id)
              .collection('toegang')
              .doc(doc.id)
              .update(data)
            this.gebruikersMetRol.push(gebruiker)
            this.voegToeDialog = false
          })
        })
    },
    haalRolOp(rol) {
      this.huidigeRol = rol
      this.rolDialog = true
    },
    updateContactLeiding(gebruiker) {
      const ref = db.collection('leiders')
        .doc('leidersdoc')

        ref
        .get()
        .then((doc) => (ref.set({leiders: [...doc.data().leiders, gebruiker]})))
    }
  }
}
</script>
