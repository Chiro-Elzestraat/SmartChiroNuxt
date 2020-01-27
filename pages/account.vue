<template>
  <div class="text-center">
    <div v-if="!this.$store.state.gebruiker.user.isLoggedIn">
      <!-- <v-btn @click="login('google')">Login met Google</v-btn>
      <v-btn @click="login('facebook')">Login met Facebook</v-btn> -->
      <div id="gSignInWrapper">
        <div
          @click="login('google')"
          v-ripple
          id="customBtn"
          class="customGPlusSignIn"
        >
          <span class="icon"></span>
          <span class="buttonText">Google</span>
        </div>
      </div>
    </div>
    <div v-else>
      <h1 class="display-1">
        Welkom terug, {{ this.$store.state.gebruiker.user.data.displayName }}
        <v-btn @click="loguit()">Log uit</v-btn>
      </h1>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  methods: {
    login(provider) {
      if (provider === 'google') {
        provider = new firebase.auth.GoogleAuthProvider()
      } else if (provider === 'facebook') {
        provider = new firebase.auth.FacebookAuthProvider()
      }
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          // const token = result.credential.accessToken
          // The signed-in user info.
          const user = result.user
          this.$store.commit('gebruiker/setUserData', user.toJSON())
          // ...
        })
        .catch(function(error) {
          // Handle Errors here.
          const errorCode = error.code
          const errorMessage = error.message
          // The email of the user's account used.
          const email = error.email
          // The firebase.auth.AuthCredential type that was used.
          const credential = error.credential
          console.log(errorCode + errorMessage + email + credential)
          // ...
        })
    },
    loguit() {
      firebase.auth().signOut()
    }
  }
}
</script>

<style>
#customBtn {
  display: inline-block;
  background: white;
  color: #444;
  width: 190px;
  border-radius: 5px;
  border: thin solid #aaa;
  box-shadow: 1px 1px 1px grey;
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
  background: url('../static/google.svg') transparent 5px 50% no-repeat;
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
</style>
