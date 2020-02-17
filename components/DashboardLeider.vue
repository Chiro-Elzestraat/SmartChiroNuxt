<template>
  <div>
    <v-row dense>
      <v-col v-for="card in cards" :key="card.title">
        <v-card class="mx-auto" @click="$router.push(card.page)" width="400px">
          <v-img :src="card.src" height="200px" width="400px" contain></v-img>
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
          src: '/financien.svg',
          page: '/finance'
        },
        {
          title: 'Verhuur',
          icon: 'mid-account_box',
          src: '/verhuur.svg',
          page: '/verhuur'
        },
        {
          title: 'Evenementen',
          icon: 'mid-gavel',
          src: '/evenementen.svg',
          page: '/events'
        }
      ]
    }
  }
}
</script>
