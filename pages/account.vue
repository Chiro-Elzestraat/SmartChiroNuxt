<template>
  <div class="text-center">
    <div v-if="!this.$store.state.gebruiker.user.isLoggedIn">
      <v-btn @click="login('google')">Login met Google</v-btn>
      <v-btn @click="login('facebook')">Login met Facebook</v-btn>
    </div>
    <div v-else>
      <h1 class="display-1">
        Welkom terug, {{ this.$store.state.gebruiker.user.data.displayName }}
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
    }
  }
}
</script>

<style></style>
