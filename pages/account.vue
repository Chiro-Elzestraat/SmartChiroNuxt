<template>
  <v-container>
    <div v-if="!this.$store.state.gebruiker.user.isLoggedIn">
      <v-alert type="info">
        Belangrijk: Log steeds in met hetzelfde account om te vermijden dat je opnieuw je leden moet inschrijven. Als het lijkt dat er gegevens ontbreken, probeer dan een andere inlogmethode.
      </v-alert>
      <img
        class="logo"
        src="/icon.png"
        alt="Logo SmartChiro"
        style="margin: 0 auto;display: block;"
      />
      <v-card outlined width="500" style="margin: 16px auto; display: block;">
        <v-card-title>Aanbevolen</v-card-title>
        <v-card-subtitle>Ingelogd in slechts 1 klik</v-card-subtitle>
        <v-card-text>
          <div id="loginButtons">
            <!-- <v-btn @click="login('google')">Login met Google</v-btn>
            <v-btn @click="login('facebook')">Login met Facebook</v-btn> -->
            <div id="gSignInWrapper">
              <div @click="login('google')" v-ripple class="customBtn">
                <span class="icon google"></span>
                <span class="buttonText">Google</span>
              </div>
            </div>
            <div id="fSignInWrapper">
              <div
                @click="login('facebook')"
                v-ripple
                class="facebook customBtn"
              >
                <span class="icon facebook"></span>
                <span class="buttonText">Facebook</span>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
      <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" style="margin: 0 auto; display: block;"
            ><v-icon style='margin-right: 10px'>mdi-email</v-icon>Login met e-mail</v-btn
          >
        </template>
        <v-card outlined>
          <v-card-title>Login met e-mail</v-card-title>
          <v-card-text>
            <v-tabs v-model="tab" show-arrows>
              <v-tab>Login</v-tab>
              <v-tab>Registreer</v-tab>
              <v-tab>Wachtwoord vergeten</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-container>
                  <v-text-field
                    v-model="email"
                    outlined
                    label="E-mail"
                  ></v-text-field>
                  <v-text-field
                    v-model="wachtwoord"
                    outlined
                    label="Wachtwoord"
                    type="password"
                  ></v-text-field>
                  <v-btn @click="loginEmail" :loading="laden">Login</v-btn>
                </v-container>
              </v-tab-item>
              <v-tab-item>
                <v-container>
                  <v-text-field
                    v-model="emailr"
                    outlined
                    label="E-mail"
                  ></v-text-field>
                  <v-text-field
                    v-model="wachtwoordr"
                    outlined
                    label="Wachtwoord"
                    type="password"
                  ></v-text-field>
                  <v-text-field
                    v-model="herhaalwachtwoordr"
                    outlined
                    label="Herhaal wachtwoord"
                    type="password"
                  ></v-text-field>
                  <v-btn @click="maakAccount" :loading="laden"
                    >Registreer</v-btn
                  >
                </v-container>
              </v-tab-item>
              <v-tab-item>
                <v-container>
                  <v-text-field
                    v-model="emailVergeten"
                    outlined
                    label="E-mail"
                  ></v-text-field>
                  <v-btn @click="wachtwoordVergeten" :loading="laden"
                    >Stuur reset e-mail</v-btn
                  >
                </v-container>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
    <div v-else class="loggedIn">
      <div v-if="this.$store.state.gebruiker.user.nieuweGebruiker">
        <h1 class="display-1 text-center">
          Welkom op SmartChiro{{ displayName ? `, ${displayName}` : '' }}!<br />
          Vervolledig je profiel om verder te gaan.
        </h1>
        <NieuweGebruiker />
      </div>
      <div v-else class="text-center">
        <h1 class="display-1">
          Welkom terug{{ displayName ? `, ${displayName}` : '' }}
        </h1>
        <br />
        <p v-if="this.$store.state.gebruiker.user.ouder">
          Wil je leden inschrijven? Dat kan via het
          <a @click="$router.push('/')">dashboard</a>.
        </p>
        </div>
        <ContactLeider v-if="leider"/>
      <v-btn @click="loguit()" bottom right absolute>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </div>
    <v-dialog v-model="errorDialog" width="500">
      <v-card>
        <v-card-title>Er is iets fout gegaan.</v-card-title>
        <v-card-subtitle>{{ error.code }}</v-card-subtitle>
        <v-card-text class="text--primary">{{ error.message }}</v-card-text>
        <v-card-actions>
          <v-btn @click="errorDialog = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="emailGelukt" width="500">
      <v-card>
        <v-card-title>Gelukt!</v-card-title>
        <v-card-text>Check je mail om je wachtwoord te resetten.</v-card-text>
        <v-card-actions>
          <v-btn @click="emailGelukt = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import firebase from 'firebase'
import ContactLeider from '@/components/ContactLeider'
import NieuweGebruiker from '../components/NieuweGebruiker'
export default {
  components: {
    NieuweGebruiker,
    ContactLeider
  },
  data() {
    return {
      tab: 0,
      email: '',
      wachtwoord: '',
      emailr: '',
      wachtwoordr: '',
      herhaalwachtwoordr: '',
      laden: false,
      dialog: false,
      errorDialog: false,
      error: {},
      emailVergeten: '',
      emailGelukt: false
    }
  },
  computed: {
    displayName() {
      return this.$store.state.gebruiker.user.data.displayName
    },
    leider() {
      return this.$store.state.gebruiker.user.leider
    }
  },
  mounted() {
    firebase
      .auth()
      .getRedirectResult()
      .then(function(result) {
        if (result.credential) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          // var token = result.credential.accessToken
          // ...
        }
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const token = result.credential.accessToken
        // The signed-in user info.
        this.checkNieuw()
        const user = result.user
        this.$store.commit('gebruiker/setUserData', user.toJSON())
      })
      .catch(function(error) {
        // Handle Errors here.
        const errorCode = error.code
        const errorMessage = error.message
        // The email of the user's account used.
        const email = error.email
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential
        // ...
        console.warn(errorCode, errorMessage, email, credential)
      })
    firebase.auth().onAuthStateChanged((user) => {
      if (user) this.checkNieuw()
    })
  },
  methods: {
    login(provider) {
      if (provider === 'google') {
        provider = new firebase.auth.GoogleAuthProvider()
      } else if (provider === 'facebook') {
        provider = new firebase.auth.FacebookAuthProvider()
      }
      firebase.auth().signInWithRedirect(provider)
    },
    maakAccount(email, password) {
      if (this.wachtwoordr === this.herhaalwachtwoordr) {
        this.laden = true
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.emailr, this.wachtwoordr)
          .then(() => {
            this.emailr = ''
            this.wachtwoordr = ''
            this.herhaalwachtwoordr = ''
            this.laden = false
          })
          .catch((error) => {
            this.error = error
            this.errorDialog = true
            this.laden = false
          })
      } else {
        this.error = {
          code: 'input/passwords-do-not-match',
          message: 'Wachtwoorden komen niet overeen.'
        }
        this.errorDialog = true
      }
    },
    loginEmail() {
      this.laden = true
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.wachtwoord)
        .then(() => {
          this.email = ''
          this.wachtwoord = ''
          this.laden = false
        })
        .catch((error) => {
          this.errorDialog = true
          this.error = error
          this.laden = false
        })
    },
    wachtwoordVergeten() {
      this.laden = true
      firebase
        .auth()
        .sendPasswordResetEmail(this.emailVergeten)
        .then(() => {
          this.emailGelukt = true
          this.laden = false
          this.emailVergeten = ''
        })
        .catch((error) => {
          this.errorDialog = true
          this.error = error
          this.laden = false
        })
    },
    loguit() {
      firebase.auth().signOut()
      this.$store.commit('menu/resetState')
      this.$store.commit('gebruiker/loguit')
    },
    checkNieuw() {
      firebase
        .auth()
        .currentUser.getIdTokenResult(true)
        .then((idTokenResult) => {
          if (idTokenResult.claims.ouder || idTokenResult.claims.rollen
          ) {
            this.$store.commit('gebruiker/setNieuweGebruiker', false)
          } else {
            this.$store.commit('gebruiker/setNieuweGebruiker', true)
          }
        })
        .catch((error) => {
          console.warn(error)
          // this.$store.commit('gebruiker/setNieuweGebruiker', false)
          // this.$router.push('/geeninternet')
        })
    },
  },
  head() {
    return {
      title: 'Account'
    }
  }
}
</script>

<style>
.logo {
  width: 200px;
}
.customBtn {
  margin: 8px;
  display: block;
  background: white;
  color: #444;
  width: 190px;
  border-radius: 5px;
  border: 1px solid #eee;
  white-space: nowrap;
}
@media (max-width: 418px) {
  .customBtn {
    margin: 16px auto;
  }
}

.customBtn:hover {
  cursor: pointer;
}
span.label {
  font-family: serif;
  font-weight: normal;
}
span.icon {
  background-size: 36px;
  margin-left: 8px;
  display: inline-block;
  vertical-align: middle;
  width: 42px;
  height: 42px;
}
.google {
  background: url('../static/google.svg') center no-repeat;
}
.facebook {
  background: url('../static/facebook.svg') center no-repeat;
}
span.icon {
  background-size: 36px;
  margin-left: 8px;
  display: inline-block;
  vertical-align: middle;
  width: 42px;
  height: 42px;
}
span.buttonText {
  display: inline-block;
  vertical-align: middle;
  padding-left: 42px;
  padding-right: 42px;
  font-size: 14px;
  font-weight: bold;
  /* Use the Roboto font that is loaded in the <head> */
  font-family: 'Roboto', sans-serif;
}
#loginButtons {
  display: flex;
  justify-content: center;
}
@media (orientation: portrait) {
  #loginButtons {
    flex-direction: column;
  }
}
.loggedIn {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
