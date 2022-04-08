import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCclD0kujmG3-8Bay9YTRfmFLWYh4_R8j8",
  authDomain: "gymbo-8be90.firebaseapp.com",
  projectId: "gymbo-8be90",
  storageBucket: "gymbo-8be90.appspot.com",
  messagingSenderId: "1035700660645",
  appId: "1:1035700660645:web:dfee4eb08ddf4f5d3da04c",
};

// Initialize Firebase
const FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(FirebaseApp);

const unsub = onAuthStateChanged(auth, (user) => {
  store.commit("setUser", user);
  unsub();
  createApp(App).use(store).use(router).mount("#app");
});
