
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDzOHv9o13deghVsVhT1O8SrRoM7bpRQQA",
  authDomain: "sultan-super-app.firebaseapp.com",
  projectId: "sultan-super-app",
  storageBucket: "sultan-super-app.appspot.com",
  messagingSenderId: "757345977494",
  appId: "1:757345977494:web:0364672331b0195f292eb7"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
