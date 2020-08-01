<template>
  <div>
    <OptieDivider
      text="Rollenbeheer"
      icon="mdi-account-multiple"
      class="pa-0"
    />
    <v-row class="text-center">
      <v-col cols="4">
        <div @click="haalGroepsleidingOp">
          <v-btn fab color="primary">
            <v-icon>mdi-account</v-icon>
          </v-btn>
          <p>Groepsleider</p>
        </div>
      </v-col>
      <v-col cols="4">
        <v-btn fab color="primary">
          <v-icon>mdi-laptop</v-icon>
        </v-btn>
        <p>Website</p>
      </v-col>
      <v-col cols="4">
        <v-btn fab color="primary">
          <v-icon>mdi-cash-register</v-icon>
        </v-btn>
        <p>Kas</p>
      </v-col>
      <v-col cols="4">
        <v-btn fab color="primary">
          <v-icon>mdi-home</v-icon>
        </v-btn>
        <p>Verhuur</p>
      </v-col>
      <v-col cols="4">
        <v-btn fab color="primary">
          <v-icon>mdi-whistle</v-icon>
        </v-btn>
        <p>Leider</p>
      </v-col>
    </v-row>
    <v-dialog v-model="groepsleider" width="500">
      <v-card>
        <v-card-title>Groepsleider</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              two-line
              v-for="leider in groepsleiding"
              :key="leider.gsm"
            >
              <v-list-item-content>
                <v-list-item-title>{{ leider.naam }}</v-list-item-title>
                <v-list-item-subtitle>{{ leider.gsm }}</v-list-item-subtitle>
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
      groepsleider: false,
      groepsleiding: []
    }
  },
  methods: {
    haalGroepsleidingOp() {
      this.groepsleider = true
      this.groepsleiding = []
      const groepsleiders = db
        .collectionGroup('toegang')
        .where('heeft', 'array-contains', 'groepsleider')
        .get()
        .then((docs) =>
          docs.forEach((doc) =>
            doc.ref.parent.parent
              .get()
              .then((leider) => this.groepsleiding.push(leider.data()))
          )
        )
      console.log(groepsleiders)
    }
  }
}
</script>
