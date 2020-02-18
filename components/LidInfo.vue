<template>
  <v-tabs fixed-tabs background-color="primary" dark>
    <v-tab>Contact</v-tab>
    <v-tab>Medische info</v-tab>
    <v-tab>Betaling</v-tab>
    <v-tab-item>
      <div>
        <h1 class="title">Ouders</h1>
        <div class="contact">
          <v-card
            outlined
            v-for="(ouder, i) in lid.contact.ouders"
            :key="i"
            class="contactpersoon"
          >
            <v-card-title class="headline">Ouder {{ i + 1 }}</v-card-title>
            <v-card-subtitle>{{ ouder.naam }}</v-card-subtitle>
            <v-card-text class="text--primary">
              <a :href="'tel:' + ouder.gsm">{{ ouder.gsm }}</a
              ><br />
              <a :href="'mailto:' + ouder.mail">{{ ouder.mail }}</a>
            </v-card-text>
          </v-card>
        </div>
        <v-divider />
        <h1 class="title">Extra contactpersonen</h1>
        <div class="contact">
          <v-card
            outlined
            v-for="(extra, i) in lid.contact.extra"
            :key="i"
            class="contactpersoon"
          >
            <v-card-title class="headline">{{ extra.relatie }}</v-card-title>
            <v-card-subtitle>{{ extra.naam }}</v-card-subtitle>
            <v-card-text class="text--primary"
              ><a :href="'tel:' + extra.gsm">{{ extra.gsm }}</a></v-card-text
            >
          </v-card>
          <v-card outlined class="contactpersoon">
            <v-card-title class="headline">Huisarts</v-card-title>
            <v-card-subtitle>{{ lid.contact.huisarts.naam }}</v-card-subtitle>
            <v-card-text class="text--primary"
              ><a :href="'tel:' + lid.contact.huisarts.gsm">{{
                lid.contact.huisarts.gsm
              }}</a></v-card-text
            >
          </v-card>
        </div>
      </div>
    </v-tab-item>
    <v-tab-item>
      <div class="medischeFiche">
        <v-card class="medischeKaart" outlined>
          <v-card-title
            :class="{
              goed: lid.medischeFiche.medischeHandelingen,
              belangrijk: !lid.medischeFiche.medischeHandelingen
            }"
          >
            Medische handelingen
          </v-card-title>
          <v-card-subtitle
            >mogen
            {{ lid.medischeFiche.medischeHandelingen ? '' : 'niet' }} worden
            uitgevoerd</v-card-subtitle
          >
        </v-card>
        <v-card class="medischeKaart" outlined>
          <v-card-title
            :class="{
              goed:
                lid.medischeFiche.tetanus.gevaccineerd &&
                lid.medischeFiche.tetanus.jaar,
              belangrijk: !lid.medischeFiche.tetanus.gevaccineerd,
              waarschuwing: lid.medischeFiche.tetanus.gevaccineerd
            }"
            >Is
            {{ lid.medischeFiche.tetanus.gevaccineerd ? '' : 'niet' }}
            gevaccineerd tegen tetanus</v-card-title
          >
          <v-card-subtitle>{{
            lid.medischeFiche.tetanus.jaar
              ? `In het jaar ${lid.medischeFiche.tetanus.jaar}`
              : `Jaar onbekend`
          }}</v-card-subtitle>
        </v-card>
      </div>
    </v-tab-item>
    <v-tab-item>
      <BetalingInfo :lidId="lid.lidId" />
    </v-tab-item>
  </v-tabs>
</template>

<script>
import BetalingInfo from '@/components/BetalingInfo'
export default {
  components: {
    BetalingInfo
  },
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
.medischeFiche {
  display: flex;
  flex-wrap: wrap;
  /* row-gap: 2rem;
  column-gap: 2rem; */
}
.medischeKaart {
  margin: 8px;
}
.contactpersoon {
  margin: 16px auto;
  min-width: 200px;
}
.contact {
  display: flex;
  flex-wrap: wrap;
}
</style>
