<template>
  <v-tabs fixed-tabs background-color="primary" dark>
    <v-tab>Contact</v-tab>
    <v-tab>Medische info</v-tab>
    <v-tab-item>
      <div class="contact">
        <div
          v-for="(ouder, i) in lid.contact.ouders"
          :key="i"
          class="contactpersoon"
        >
          <h1 class="headline">Ouder {{ i + 1 }}</h1>
          {{ ouder.naam }}<br />
          <a :href="'tel:' + ouder.gsm">{{ ouder.gsm }}</a
          ><br />
          <a :href="'mailto:' + ouder.mail">{{ ouder.mail }}</a>
        </div>
      </div>
    </v-tab-item>
    <v-tab-item> </v-tab-item>
  </v-tabs>
</template>

<script>
export default {
  props: {
    lid: Object
  }
}
</script>

<style></style>
