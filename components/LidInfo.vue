<template>
  <v-tabs fixed-tabs background-color="primary" dark>
    <v-tab>Contact</v-tab>
    <v-tab>Medische info</v-tab>
    <v-tab>Betaling</v-tab>
    <v-tab-item>
      <div>
        {{ lid.email }}
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
        <v-divider />
        <v-card>
          <v-card-title>Adres</v-card-title>
          <v-card-text>
            {{ lid.adres.straat }} {{ lid.adres.huisnummer }}
            {{ lid.adres.bus }} {{ lid.adres.postcode }} {{ lid.adres.plaats }}
          </v-card-text>
        </v-card>
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
            :class="
              Object.keys(lid.medischeFiche.aandoeningen).length == 0
                ? 'goed'
                : 'belangrijk'
            "
            >Aandoeningen</v-card-title
          >
          <v-card-subtitle
            v-if="Object.keys(lid.medischeFiche.aandoeningen).length == 0"
            >Geen aandoeningen gekend</v-card-subtitle
          >
          <v-card-text v-else>
            <v-checkbox
              disabled
              v-for="(waarde, aandoening) in lid.medischeFiche.aandoeningen"
              :key="aandoening"
              :label="aandoening"
              :input-value="waarde"
              hide-details
            ></v-checkbox>
          </v-card-text>
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
        <v-card class="medischeKaart" outlined>
          <v-card-title
            :class="
              lid.medischeFiche.allergieen.length <= 0 ? 'goed' : 'belangrijk'
            "
            >Allergieën</v-card-title
          >
          <v-card-subtitle v-if="lid.medischeFiche.allergieen.length <= 0"
            >Geen allergieën gekend</v-card-subtitle
          >
          <v-card-text v-else>
            <ul>
              <li
                v-for="(allergie, index) in lid.medischeFiche.allergieen"
                :key="index"
              >
                {{ allergie.type }} - {{ allergie.beschrijving }}
              </li>
            </ul>
          </v-card-text>
        </v-card>
        <v-card
          v-if="lid.medischeFiche.extraInfo"
          class="medischeKaart"
          outlined
        >
          <v-card-title>Extra informatie</v-card-title>
          <v-card-subtitle
            >In verband met aandoeningen &amp; allergieën</v-card-subtitle
          >
          <v-card-text>{{ lid.medischeFiche.extraInfo }}</v-card-text>
        </v-card>
        <v-card class="medischeKaart" outlined>
          <v-card-title
            :class="!lid.medischeFiche.vroegereZiekten ? 'goed' : 'belangrijk'"
            >Vroegere ziekten</v-card-title
          >
          <v-card-subtitle v-if="!lid.medischeFiche.vroegereZiekten"
            >Geen vroegere ziekten of heelkundige ingrepen
            gekend.</v-card-subtitle
          >
          <v-card-subtitle v-else>
            {{ lid.medischeFiche.vroegereZiekten }}
          </v-card-subtitle>
        </v-card>
        <v-card class="medischeKaart" outlined>
          <v-card-title
            :class="!lid.medischeFiche.dieet ? 'goed' : 'waarschuwing'"
            >Dieet</v-card-title
          >
          <v-card-subtitle v-if="!lid.medischeFiche.dieet"
            >Lid volgt geen dieet</v-card-subtitle
          >
          <v-card-subtitle v-else>{{
            !lid.medischeFiche.dieetDetails
              ? 'Geen details opgegeven.'
              : lid.medischeFiche.dieetDetails
          }}</v-card-subtitle>
        </v-card>
        <v-card class="medischeKaart" outlined>
          <v-card-title
            :class="
              lid.medischeFiche.kanDeelnemen &&
              lid.medischeFiche.kanZwemmen &&
              !lid.medischeFiche.vlugMoe
                ? 'goed'
                : 'belangrijk'
            "
            >Deelname</v-card-title
          >
          <v-card-subtitle
            v-if="
              lid.medischeFiche.kanDeelnemen &&
                lid.medischeFiche.kanZwemmen &&
                !lid.medischeFiche.vlugMoe
            "
            >Alles ziet er goed uit</v-card-subtitle
          >
          <v-card-subtitle v-else
            >{{
              lid.medischeFiche.kanDeelnemen
                ? ''
                : 'Kan niet deelnemen aan sport & spel aangepast aan zijn leeftijd'
            }}
            {{ lid.medischeFiche.kanZwemmen ? '' : 'Kan niet zwemmen' }}
            {{
              lid.medischeFiche.vlugMoe ? 'Is vlug moe' : ''
            }}</v-card-subtitle
          >
        </v-card>
        <v-card class="medischeKaart" v-if="lid.aanvullendeInfo" outlined>
          <v-card-title>Aanvullende info</v-card-title>
          <v-card-subtitle>{{ lid.aanvullendeInfo }}</v-card-subtitle>
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
.waarschuwing {
  color: orange;
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
