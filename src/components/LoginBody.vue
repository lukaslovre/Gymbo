<template>
  <h1>Log in</h1>
  <form @submit.prevent="login">
    <label for="email">Email:</label>
    <input type="email" name="email" id="email" v-model="emailValue" />
    <label for="password">Password:</label>
    <input
      type="password"
      name="password"
      id="password"
      v-model="passwordValue"
    />
    <button>Submit</button>
  </form>
</template>

<script>
import { ref } from "@vue/reactivity";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "RegisterBody",
  setup() {
    const auth = getAuth();
    const store = useStore();
    const router = useRouter();

    const emailValue = ref("");
    const passwordValue = ref("");

    const login = () => {
      signInWithEmailAndPassword(auth, emailValue.value, passwordValue.value)
        .then((userCredential) => {
          const user = userCredential.user;
          store.commit("setUser", user);
          router.push("/");
          //console.log(user);
        })
        .catch((err) => {
          const errorCode = err.code;
          const errorMessage = err.message;
          console.log(errorMessage);
        });
    };

    return { emailValue, passwordValue, login };
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin: 3rem 0;
  font-weight: 500;
}
form {
  width: 75%;
  margin: auto;
}

input {
  width: 100%;
  padding: 1em;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
  font-size: 1rem;
  color: #3c3c3c;
  background-color: #f1f1f1;
  border: none;
  outline: none;
  border-bottom: #929292 2px solid;
}
input:focus {
  background-color: white;
  border-bottom: #7067cf 4px solid;
  margin-bottom: calc(1.5rem - 2px);
}
button {
  display: block;
  margin: 1rem auto;
  padding: 0.375em 0.75em;
  background-color: #7067cf;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.625rem;
  font-weight: 600;
  color: #f5f5f5;
}
button:hover {
  border: #3c3c3c 2px solid;
}
</style>
