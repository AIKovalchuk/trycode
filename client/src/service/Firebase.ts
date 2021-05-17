import firebase from "firebase/app";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyBwSrVk2CD7fplTa5i5z5csTPV8qMAWlow",
  authDomain: "trycode-81e4e.firebaseapp.com",
  projectId: "trycode-81e4e",
  storageBucket: "trycode-81e4e.appspot.com",
  messagingSenderId: "458211077260",
  appId: "1:458211077260:web:2521a121fd8e44023d5fa9",
  measurementId: "G-QYP8CY3C6D",
};

const app = firebase.initializeApp(config);

export const auth = app.auth();
export default app;
