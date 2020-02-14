<template>
  <div>
    <v-row dense>
      <v-col
        v-for="card in cards"
        :key="card.title"
        :cols="card.flex"
        :img="card.src"
        :page="card.page"
      >
        <v-card
          class="mx-auto"
          @click="this.$router.push(card.page)"
          height="100%"
          width="68%"
        >
          <v-img :src="card.src" height="200px" width="400px"></v-img>
          <v-card-title v-text="card.title"></v-card-title>
          <v-card-actions class="justify-center">
            <v-btn outlined color="primary" text>Ga naar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cards: [
        {
          title: 'Financiën',
          icon: 'mdi-dashboard',
          src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg',
          page: '/Finance'
        },
        {
          title: 'Verhuur',
          icon: 'mid-account_box',
          src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg',
          page: '/Verhuur'
        },
        {
          title: 'Evenementen',
          icon: 'mid-gavel',
          src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg',
          page: '/Events'
        },
        {
          title: 'Men Klute',
          icon: 'mid-gjkj',
          src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg',
          page: '/kloet'
        }
      ]
    }
  }
}
</script>
