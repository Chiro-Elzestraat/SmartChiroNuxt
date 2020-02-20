<template>
  <div class="text-center">
    <div v-if="!this.$store.state.gebruiker.user.isLoggedIn" id="loginButtons">
      <!-- <v-btn @click="login('google')">Login met Google</v-btn>
      <v-btn @click="login('facebook')">Login met Facebook</v-btn> -->
      <div id="gSignInWrapper">
        <div @click="login('google')" v-ripple id="customBtn">
          <span class="icon google"></span>
          <span class="buttonText">Google</span>
        </div>
      </div>
      <div id="fSignInWrapper">
        <div
          @click="login('facebook')"
          v-ripple
          id="customBtn"
          class="facebook"
        >
          <span class="icon facebook"></span>
          <span class="buttonText">Facebook</span>
        </div>
      </div>
    </div>
    <div v-else class="loggedIn">
      <div v-if="this.$store.state.gebruiker.user.nieuweGebruiker">
        <h1 class="display-1">
          Welkom op SmartChiro,
          {{ this.$store.state.gebruiker.user.data.displayName }}!<br />
          Vervolledig je profiel om verder te gaan.
        </h1>
        <NieuweGebruiker />
      </div>
      <div v-else>
        <h1 class="display-1">
          Welkom terug, {{ this.$store.state.gebruiker.user.data.displayName }}
        </h1>
        <br />
        <p v-if="this.$store.state.gebruiker.user.ouder">
          Wil je leden inschrijven? Dat kan via het
          <a @click="$router.push('/')">dashboard</a>.
        </p>
      </div>
      <v-btn id="loguit" @click="loguit()">Log uit</v-btn>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import NieuweGebruiker from '../components/NieuweGebruiker'
export default {
  components: {
    NieuweGebruiker
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
    loguit() {
      firebase.auth().signOut()
      this.$store.commit('menu/resetState')
    },
    checkNieuw() {
      firebase
        .auth()
        .currentUser.getIdTokenResult()
        .then((idTokenResult) => {
          if (idTokenResult.claims.leider || idTokenResult.claims.ouder) {
            console.log('test')
            this.$store.commit('gebruiker/setNieuweGebruiker', false)
          } else {
            this.$store.commit('gebruiker/setNieuweGebruiker', true)
          }
        })
        .catch((error) => {
          console.log(error)
          this.$store.commit('gebruiker/setNieuweGebruiker', false)
          this.$router.push('/geeninternet')
        })
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
        console.log(errorCode, errorMessage, email, credential)
      })
    firebase.auth().onAuthStateChanged((user) => {
      if (user) this.checkNieuw()
    })
  },
  head() {
    return {
      title: 'Account'
    }
  }
}
</script>

<style>
#customBtn {
  margin: 16px;
  display: inline-block;
  background: white;
  color: #444;
  width: 190px;
  border-radius: 5px;
  border: 1px solid #eee;
  white-space: nowrap;
}

#customBtn:hover {
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
  height: calc(100vh - 86px);
  flex-direction: column;
  justify-content: space-between;
}
#loguit {
  width: 100%;
  align-self: bottom;
}
</style>
