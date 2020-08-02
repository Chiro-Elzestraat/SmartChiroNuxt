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
            <v-icon>{{rollen.icon[index]}}</v-icon>
          </v-btn>
          <p>{{rolnaam}}</p>
        </div>
      </v-col>
    </v-row>
    <v-dialog v-model="rolDialog" width="500">
      <v-card>
        <v-card-title>{{huidigeRol}}</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="gebruiker in gebruikersMetRol"
              :key="gebruiker.gsm"
              two-line
            >
              <v-list-item-content>
                <v-list-item-title>{{ gebruiker.naam }}</v-list-item-title>
                <v-list-item-subtitle>{{ gebruiker.gsm }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn bottom right absolute>
            <v-icon fab>mdi-plus</v-icon>
          </v-btn>
        </v-card-actions>
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
        naam:['Groepsleider', 'Website', 'Kas', 'Verhuur', 'Leider'],
        icon:['mdi-account', 'mdi-laptop', 'mdi-cash-register', 'mdi-home', 'mdi-whistle']
    },
      rolDialog: false,
      huidigeRol: '',
      gebruikersMetRol: [] // dit moet nog van naam veranderen want is niet meer logisch
    }
  },
  methods: {
    haalRolOp(rol) {
      this.huidigeRol = rol
      rol = rol.toLowerCase()
      this.rolDialog = true
      this.gebruikersMetRol = []
      const groepsleiders = db
        .collectionGroup('toegang')
        .where('heeft', 'array-contains', rol)
        .get()
        .then((docs) =>
          docs.forEach((doc) =>
            doc.ref.parent.parent
              .get()
              .then((leider) => this.gebruikersMetRol.push(leider.data()))
          )
        )
      console.log(groepsleiders)
    }
  }
}
</script>
