import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvT2C6imYAmMBEcPfbgERg9GCaRPk0Rgc",
  authDomain: "keyshare-5caf0.firebaseapp.com",
  projectId: "keyshare-5caf0",
  storageBucket: "keyshare-5caf0.appspot.com",
  messagingSenderId: "186273716474",
  appId: "1:186273716474:web:2ec5e70a7c0bc5f10cd143"
};

firebase.initializeApp(firebaseConfig);

export default firebase