<template>
  <div class="geeninternet">
    <h1 class="headline">
      U bent niet verbonden met het internet. Maak verbinding en herlaad de
      pagina om verder te gaan.
    </h1>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  head() {
    return {
      title: 'Geen internetverbinding'
    }
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase
          .auth()
          .currentUser.getIdTokenResult()
          .then((idTokenResult) => {
            if (idTokenResult.claims.leider || idTokenResult.claims.ouder) {
              this.$store.commit('gebruiker/setNieuweGebruiker', false)
            } else {
              this.$store.commit('gebruiker/setNieuweGebruiker', true)
            }
            this.$router.push('/account')
          })
          .catch((error) => {
            console.warn(error)
          })
      }
    })
  }
}
</script>

<style>
.geeninternet {
  background-image: url('/geeninternet.svg');
  height: 80vh;
  display: flex;
  align-items: center;
  color: #888888;
  text-align: center;
}
</style>
