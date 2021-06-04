import firebase from 'firebase'
import 'firebase/storage'

const firebaseapp = firebase.initializeApp({
    apiKey: "AIzaSyDzG5eU0u9by3KmeZXhKhA0y_D9hr7qPGw",
    authDomain: "instagram-clone-14c6d.firebaseapp.com",
    projectId: "instagram-clone-14c6d",
    storageBucket: "instagram-clone-14c6d.appspot.com",
    messagingSenderId: "553865786201",
    appId: "1:553865786201:web:adf79741f96cac49e6d248",
    measurementId: "G-GVVWKKQ5NP"
})

const db = firebaseapp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage, firebase };


