import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD5eILQ-2nx9tGwNCEsEFxJ17CECBW7dio",
  authDomain: "twitter-5c9b5.firebaseapp.com",
  projectId: "twitter-5c9b5",
  storageBucket: "twitter-5c9b5.appspot.com",
  messagingSenderId: "328291764835",
  appId: "1:328291764835:web:9c97aa770505fc81054656",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export { db, storage, auth, provider };
