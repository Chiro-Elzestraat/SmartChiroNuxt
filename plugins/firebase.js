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
export const auth = app.auth()
// firebase.analytics();
