// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import "firebase/compat/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYQdHki0v-c7wIluKGXqP12h0fiH-x-R8",
  authDomain: "dummy-bb73d.firebaseapp.com",
  projectId: "dummy-bb73d",
  storageBucket: "dummy-bb73d.appspot.com",
  messagingSenderId: "349858091135",
  appId: "1:349858091135:web:a7e976daefc382cece2f4a",
  measurementId: "G-6PKWMVJD10"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
// Export firestore database
// It will be imported into your react app whenever it is needed
export const db = firebase.firestore(app);