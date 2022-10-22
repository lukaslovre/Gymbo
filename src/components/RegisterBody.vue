<template>
  <h1>Register</h1>
  <form @submit.prevent="register">
    <label for="email">Email:</label>
    <input
      type="email"
      name="email"
      id="email"
      autocomplete="email"
      v-model="emailValue"
    />

    <label for="password">Password:</label>
    <input
      type="password"
      name="password"
      id="password"
      autocomplete="new-password"
      v-model="passwordValue"
    />

    <label for="passwordConf">Confirm password:</label>
    <input
      type="password"
      name="passwordConf"
      id="passwordConf"
      autocomplete="new-password"
      v-model="passwordConfValue"
    />

    <button>Submit</button>
  </form>
</template>

<script>
import { ref } from "@vue/reactivity";
import { passRegisterParameters } from "../JSfunctions/index.js";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getFirestore } from "@firebase/firestore";

export default {
  name: "RegisterBody",
  setup() {
    const auth = getAuth();
    const db = getFirestore();
    const store = useStore();
    const router = useRouter();

    const emailValue = ref("");
    const passwordValue = ref("");
    const passwordConfValue = ref("");

    const register = () => {
      const { valid, errorMsg } = passRegisterParameters(
        emailValue.value,
        passwordValue.value,
        passwordConfValue.value
      );

      if (!valid) {
        console.log(errorMsg);
        alert(errorMsg);
        return;
      }

      createUserWithEmailAndPassword(
        auth,
        emailValue.value,
        passwordValue.value
      )
        .then((userCredential) => {
          const user = userCredential.user;
          store.commit("setUser", user);
          // dodavanje user dokumenta u FireStore:
          const userInfo = {
            friends: [],
            username: emailValue.value,
          };
          setDoc(doc(db, "users", user.uid), userInfo).catch((e) => {
            console.error("Error adding document: ", e);
          });

          const scheduleData = {
            username: emailValue.value,
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: [],
          };
          setDoc(doc(db, "schedules", user.uid), scheduleData).catch((e) => {
            console.error("Error adding document: ", e);
          });
          // ^^
          router.push("/");
        })
        .catch((err) => {
          const errorCode = err.code;
          const errorMessage = err.message;
          console.log(errorMessage);
          alert(errorMessage);
        });
    };

    return { emailValue, passwordValue, passwordConfValue, register };
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin: 3rem 0;
  font-weight: 600;
}
form {
  width: 75%;
  margin: auto;
}
label {
  font-weight: 600;
}
input {
  width: 100%;
  margin-top: 0.5rem;
  margin-bottom: 2rem;

  padding: 1em 1.25em;
  background-color: #fff;
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.125);

  font-size: 1.125rem;
  color: #808080;
  font-weight: 500;
}

button {
  display: block;
  margin: 1rem auto;
  padding: 0.375em 1em;
  background-color: #7067cf;
  box-shadow: 0 0 0.25rem #7067cf;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1.625rem;
  font-weight: 700;
  color: #f5f5f5;

  transition: transform 100ms ease;
}
button:hover,
button:active {
  transform: scale(0.9);
}
</style>
