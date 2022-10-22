<template>
  <nav>
    <router-link to="/">
      <img src="../assets/logo.svg" alt="logo" />
    </router-link>
    <div class="headerLinkList">
      <p class="navigationLink" v-if="user">Manage Friends</p>
      <router-link to="/login" class="navigationLink" v-if="!user">
        Log in</router-link
      >
      <router-link to="/register" class="navigationLink" v-if="!user">
        Register</router-link
      >
      <button class="navigationLink" @click="signUserOut" v-if="user">
        Sign Out
      </button>
    </div>
  </nav>
</template>

<script>
import { getAuth, signOut } from "@firebase/auth";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { computed } from "@vue/runtime-core";
export default {
  name: "Header",
  setup() {
    const store = useStore();
    const auth = getAuth();
    const router = useRouter();

    const signUserOut = () => {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          store.commit("setUser", null);
          router.push("/login");
        })
        .catch((error) => {
          const errorCode = err.code;
          const errorMessage = err.message;
          console.log(errorMessage);
        });
    };

    const user = computed(() => store.state.user);

    return { user, signUserOut };
  },
};
</script>

<style scoped>
nav {
  padding: 1.5rem;
  background-color: #7067cf;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.headerLinkList {
  display: flex;
  align-items: center;
  justify-content: right;
}
.navigationLink {
  margin-left: 1.5rem;
}
button {
  cursor: pointer;
  color: #7067cf;
  font-weight: 600;
  background-color: #fff;
  border: none;
  padding: 0.375em 0.75em;
  border-radius: 0.25rem;
}
a {
  color: inherit;
  text-decoration: none;
}
</style>
