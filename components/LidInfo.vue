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
    <v-tab-item>
      <div class="medischeInfo">
        <v-card class="medischeKaart" outlined>
          <v-card-title
            class="headline text-center"
            :class="{
              goed: lid.medischeInfo.medischeHandelingen,
              belangrijk: !lid.medischeInfo.medischeHandelingen
            }"
          >
            Medische handelingen
          </v-card-title>
          <v-card-subtitle
            >mogen
            {{ lid.medischeInfo.medischeHandelingen ? '' : 'niet' }} worden
            uitgevoerd</v-card-subtitle
          >
        </v-card>
        <v-card class="medischeKaart" outlined>
          <v-card-title
            :class="{
              goed:
                lid.medischeInfo.tetanus.gevaccineerd &&
                lid.medischeInfo.tetanus.jaar,
              belangrijk: !lid.medischeInfo.tetanus.gevaccineerd,
              waarschuwing: lid.medischeInfo.tetanus.gevaccineerd
            }"
            >Is
            {{ lid.medischeInfo.tetanus.gevaccineerd ? '' : 'niet' }}
            gevaccineerd tegen tetanus</v-card-title
          >
          <v-card-subtitle
            >In het jaar {{ lid.medischeInfo.tetanus.jaar }}</v-card-subtitle
          >
        </v-card>
      </div>
    </v-tab-item>
  </v-tabs>
</template>

<script>
export default {
  props: {
    lid: Object
  }
}
</script>

<style>
.goed {
  color: #8bc34a;
}
.belangrijk {
  color: #f44336;
}
.medischeInfo {
  display: flex;
  flex-wrap: wrap;
  /* row-gap: 2rem;
  column-gap: 2rem; */
}
.medischeKaart {
  margin: 8px;
}
</style>
