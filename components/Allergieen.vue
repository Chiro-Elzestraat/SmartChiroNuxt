<template>
  <div>
    <v-card>
      <v-tabs v-model="tab">
        <v-tab v-for="(allergie, index) in allergieen" :key="index">
          {{
            allergie.beschrijving ? allergie.beschrijving : 'Nieuwe allergie'
          }}
        </v-tab>
        <v-btn @click="addAllergie" style="margin: auto 0;">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item v-for="(allergie, index) in allergieen" :key="index">
          <v-card outlined>
            <v-card-text>
              <v-btn @click="removeAllergie(index)">
                Verwijder deze allergie
              </v-btn>
              <v-select v-model="allergie.type" :items="types"></v-select>
              <v-text-field
                v-model="allergie.beschrijving"
                label="Beschrijving"
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    lidAllergieen: {
      type: Array,
      default: () => [{}]
    }
  },
  data() {
    return {
      tab: 0,
      types: ['Voedingsmiddelen', 'Geneesmiddelen', 'Stoffen', 'Andere']
    }
  },
  computed: {
    allergieen() {
      return this.lidAllergieen
    }
  },
  methods: {
    addAllergie() {
      this.allergieen.push({})
      this.tab = this.allergieen.length - 1
    },
    removeAllergie(index) {
      this.allergieen.splice(index, 1)
    }
  }
}
</script>

<style></style>
