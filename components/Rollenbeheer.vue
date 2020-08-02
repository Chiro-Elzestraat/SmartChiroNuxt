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
    <v-dialog v-model="rolDialog" width="500">
      <v-card>
        <v-card-title>{{ huidigeRol }}</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="gebruiker in gebruikersMetRol"
              :key="gebruiker.id"
              two-line
            >
              <v-list-item-content>
                <v-list-item-title>{{ gebruiker.naam }}</v-list-item-title>
                <v-list-item-subtitle>{{ gebruiker.id }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-dialog v-model="verwijderDialog" width="500">
                <template v-slot:activator="{ on }">
                  <v-list-item-icon>
                    <v-icon
                      v-on="on"
                      :disabled="
                        $store.state.gebruiker.user.data.uid === gebruiker.id
                      "
                      >mdi-trash-can-outline</v-icon
                    >
                  </v-list-item-icon>
                </template>
                <v-card>
                  <v-card-title>Waarschuwing</v-card-title>
                  <v-card-text
                    >Bent u zeker dat u deze persoon zijn rol als
                    {{ huidigeRol }} wilt verwijderen</v-card-text
                  >
                  <v-card-actions>
                    <v-btn @click="deleteRol(gebruiker.id)" text>Ja</v-btn>
                    <v-btn @click="verwijderDialog = false" text>Nee</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
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
            <v-card-title>Ken een nieuwe rol aan een leider toe</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="zoekOpdracht"
                label="Naam"
                append-outer-icon="mdi-magnify"
                @click:append-outer="zoek()"
              ></v-text-field>
              <v-list>
                <v-list-item
                  v-for="zoekResultaat in zoekResultaten"
                  :key="zoekResultaat.id"
                  two-line
                >
                  <v-list-item-content
                    ><v-list-item-title>{{
                      zoekResultaat.naam
                    }}</v-list-item-title
                    ><v-list-item-subtitle>{{
                      zoekResultaat.id
                    }}</v-list-item-subtitle></v-list-item-content
                  >
                  <v-list-item-icon
                    ><v-icon
                      @click="voegRolToe(zoekResultaat)"
                      :disabled="zoekResultaat.heeftRol"
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
        naam: ['Groepsleider', 'Website', 'Kas', 'Verhuur', 'Leider'],
        icon: [
          'mdi-account',
          'mdi-laptop',
          'mdi-cash-register',
          'mdi-home',
          'mdi-whistle'
        ]
      },
      rolDialog: false,
      voegToeDialog: false,
      verwijderDialog: false,
      huidigeRol: '',
      gebruikersMetRol: [],
      zoekResultaten: [],
      zoekOpdracht: ''
    }
  },
  watch: {
    voegToeDialog(newValue, oldValue) {
      this.zoekResultaten = []
      this.zoekOpdracht = ''
    }
  },
  methods: {
    zoek() {
      this.zoekResultaten = []
      db.collection('gebruikers')
        .where('naam', '==', this.zoekOpdracht)
        .get()
        .then((docs) => {
          docs.forEach((doc) => {
            const gebruiker = { ...doc.data(), id: doc.ref.id }
            if (
              this.gebruikersMetRol.filter((g) => g.id === doc.ref.id).length >
              0
            )
              gebruiker.heeftRol = true
            this.zoekResultaten.push(gebruiker)
          })
        })
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
            this.gebruikersMetRol = this.gebruikersMetRol.filter(
              (gebruiker) => gebruiker.id !== id
            )
          })
        })
    },
    voegRolToe(gebruiker) {
      const rol = this.huidigeRol.toLowerCase()
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
      rol = rol.toLowerCase()
      this.rolDialog = true
      this.gebruikersMetRol = []
      db.collectionGroup('toegang')
        .where('heeft', 'array-contains', rol)
        .get()
        .then((docs) =>
          docs.forEach((doc) =>
            doc.ref.parent.parent.get().then((leider) =>
              this.gebruikersMetRol.push({
                ...leider.data(),
                id: leider.ref.id
              })
            )
          )
        )
    }
  }
}
</script>
