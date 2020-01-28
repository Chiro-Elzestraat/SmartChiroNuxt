<template>
  <v-tabs fixed-tabs background-color="primary" dark>
    <v-tab>Contact</v-tab>
    <v-tab>Medische info</v-tab>
    <v-tab-item>
      <div>
        <h1 class="title">Ouders</h1>
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
        <v-divider />
        <h1 class="title">Extra contactpersonen</h1>
        <div class="contact">
          <div
            v-for="(extra, i) in lid.contact.extra"
            :key="i"
            class="contactpersoon"
          >
            <h1 class="headline">{{ extra.relatie }}</h1>
            {{ extra.naam }}<br />
            <a :href="'tel:' + extra.gsm">{{ extra.gsm }}</a>
          </div>
        </div>
        <v-divider />
        <div class="contact">
          <div class="contactpersoon">
            <h1 class="headline">Huisarts</h1>
            {{ lid.contact.huisarts.naam }}<br />
            <a :href="'tel:' + lid.contact.huisarts.gsm">{{
              lid.contact.huisarts.gsm
            }}</a>
          </div>
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
