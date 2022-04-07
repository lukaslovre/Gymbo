<template>
  <nav>
    <router-link to="/">
      <img src="../assets/logo.svg" alt="logo" />
    </router-link>
    <div class="headerLinkList">
      <p class="navigationLink" v-if="user">Add Friends</p>
      <router-link to="/login" class="navigationLink" v-if="!user">
        Log in</router-link
      >
      <router-link to="/register" class="navigationLink" v-if="!user">
        Register</router-link
      >
      <a class="navigationLink" @click="signUserOut" v-if="user">Sign Out</a>
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
          router.push("/");
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
  color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.headerLinkList {
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: right;
}
.navigationLink {
  margin-left: 1.5rem;
}

a {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}
</style>
