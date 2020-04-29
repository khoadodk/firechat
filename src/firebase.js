import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBldJOcyNZb5aj4EaF_Kl8kYaAcx0Kl-jA",
  authDomain: "firechat-b8d80.firebaseapp.com",
  databaseURL: "https://firechat-b8d80.firebaseio.com",
  projectId: "firechat-b8d80",
  storageBucket: "firechat-b8d80.appspot.com",
  messagingSenderId: "641591547930",
  appId: "1:641591547930:web:75180f11f46b7002c8d9a3",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
