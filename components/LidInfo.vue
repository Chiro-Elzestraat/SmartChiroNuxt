<template>
  <v-tabs fixed-tabs background-color="primary" dark>
    <v-tab>Contact</v-tab>
    <v-tab>Medische info</v-tab>
    <v-tab>Betaling</v-tab>
    <v-tab-item>
      <div>
        <div
          style="width: 100%; background-color: #fff; display: flex;align-items: center;
  justify-content: center; flex-direction: column;"
        >
          <qrcode-vue :value="lid.lidId" style="padding: 40px;" />
          <p style="color: black;">{{ lid.lidId }}</p>
        </div>
        {{ lid.email }}
        <h1 class="title">Ouders</h1>
        <div class="contact">
          <v-card
            v-for="(ouder, i) in lid.contact.ouders"
            :key="i"
            outlined
            class="contactpersoon"
          >
            <v-card-title class="headline">Ouder {{ i + 1 }}</v-card-title>
            <v-card-subtitle>{{ ouder.naam }}</v-card-subtitle>
            <v-card-text class="text--primary">
              <a :href="'tel:' + ouder.gsm">{{ ouder.gsm }}</a
              ><br />
              <a :href="'mailto:' + ouder.email">{{ ouder.email }}</a>
            </v-card-text>
          </v-card>
        </div>
        <v-divider />
        <h1 class="title">Extra contactpersonen</h1>
        <div class="contact">
          <v-card
            v-for="(extra, i) in lid.contact.extra"
            :key="i"
            outlined
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
          <v-card color="orange">
            <v-card-title>Extra informatie i.v.m. Covid-19</v-card-title>
            <v-card-text>
              <v-container fluid>
                <v-checkbox
                  :label="
                    `Ik (of een andere volwassene uit de bubbel van ${lid.naam}) is
            7/7, 24/24 in staat om ${lid.naam} te komen ophalen tijdens het
            kamp en zal hem binnen de 24h bij een arts laten onderzoeken en zo nodig laten testen. Het resultaat van de test deel ik mee aan de medische contactpersoon van de kampbubbel.`
                  "
                  v-model="ophalen"
                  readonly
                />
                <v-checkbox
                  :label="
                    `${lid.naam} mag 1 dosis paracetamol krijgen in geval van pijn of koorts zonder ouderlijk/medisch advies.`
                  "
                  v-model="paracetamol"
                  readonly
                />
                <v-checkbox
                  :label="
                    `${lid.naam} mag gezien worden door een arts in geval van symptomen die verdacht zijn voor Covid-19 (ook wanneer de ziekte niet ernstig is).`
                  "
                  v-model="arts"
                  readonly
                />
                <v-text-field
                  v-model="rijksregisternummer"
                  label="Rijksregisternummer"
                  readonly
                ></v-text-field>
              </v-container>
            </v-card-text>
          </v-card>
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
              !lid.medischeFiche.aandoeningen ||
              Object.keys(lid.medischeFiche.aandoeningen).filter(
                (value) => lid.medischeFiche.aandoeningen[value]
              ).length == 0
                ? 'goed'
                : 'belangrijk'
            "
            >Aandoeningen</v-card-title
          >
          <v-card-subtitle
            v-if="
              !lid.medischeFiche.aandoeningen ||
                Object.keys(lid.medischeFiche.aandoeningen).filter(
                  (value) => lid.medischeFiche.aandoeningen[value]
                ).length == 0
            "
            >Geen aandoeningen gekend</v-card-subtitle
          >
          <v-card-text v-else>
            <v-checkbox
              v-for="(waarde, aandoening) in lid.medischeFiche.aandoeningen"
              v-if="waarde"
              :key="aandoening"
              :label="aandoening"
              :input-value="waarde"
              disabled
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
              waarschuwing:
                lid.medischeFiche.tetanus.gevaccineerd &&
                !lid.medischeFiche.tetanus.jaar
            }"
            >Is
            {{ lid.medischeFiche.tetanus.gevaccineerd ? '' : 'niet' }}
            gevaccineerd tegen tetanus</v-card-title
          >
          <v-card-subtitle>{{
            lid.medischeFiche.tetanus.jaar
              ? `In het jaar ${lid.medischeFiche.tetanus.jaar}`
              : (lid.medischeFiche.tetanus.gevaccineerd ? `Jaar onbekend` : '')
          }}</v-card-subtitle>
        </v-card>
        <v-card class="medischeKaart" outlined>
          <v-card-title
            :class="
              !lid.medischeFiche.allergieen ||
              lid.medischeFiche.allergieen.length <= 0
                ? 'goed'
                : 'belangrijk'
            "
            >Allergieën</v-card-title
          >
          <v-card-subtitle
            v-if="
              !lid.medischeFiche.allergieen ||
                lid.medischeFiche.allergieen.length <= 0
            "
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
        <v-card v-if="lid.aanvullendeInfo" class="medischeKaart" outlined>
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
import QrcodeVue from 'qrcode.vue'
import BetalingInfo from '@/components/BetalingInfo'
export default {
  components: {
    BetalingInfo,
    QrcodeVue
  },
  props: {
    lid: Object
  },
  computed: {
    ophalen() {
      return this.lid.medischeFiche.covid?.ophalen
    },
    paracetamol() {
      return this.lid.medischeFiche.covid?.paracetamol
    },
    arts() {
      return this.lid.medischeFiche.covid?.arts
    },
    rijksregisternummer() {
      return this.lid.medischeFiche.covid?.rijksregisternummer
        ? this.lid.medischeFiche.covid.rijksregisternummer
        : 'Niet opgegeven'
    }
  },
  methods: {
    drukaf(value) {
      console.log(value)
    }
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
.v-label {
  height: auto !important;
}
</style>
