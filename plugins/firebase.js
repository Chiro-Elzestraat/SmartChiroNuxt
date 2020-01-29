import * as firebase from 'firebase/app'

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import 'firebase/analytics'

// Add the Firebase products that you want to use
import 'firebase/auth'
const firebaseConfig = {
  apiKey: 'AIzaSyCqF9MuNGKCOFaHU1Ozbm_1Hpw2B6WI878',
  authDomain: 'smartchiro-9f399.firebaseapp.com',
  databaseURL: 'https://smartchiro-9f399.firebaseio.com',
  projectId: 'smartchiro-9f399',
  storageBucket: 'smartchiro-9f399.appspot.com',
  messagingSenderId: '505688306972',
  appId: '1:505688306972:web:e9b7a42c597498516336d9',
  measurementId: 'G-MSPMCV31BV'
}
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig)
export const functions = firebase.app().functions('europe-west1')
firebase
  .firestore()
  .enablePersistence()
  .catch(function(err) {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
    }
  })
// Subsequent queries will use persistence, if it was enabled successfully;
export const db = firebase.firestore()
export const auth = app.auth()
// firebase.analytics();
