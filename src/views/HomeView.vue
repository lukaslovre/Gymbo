<template>
  <p v-if="userAccount">Trenutni korisnik je {{ userAccount.email }}</p>

  <form @submit.prevent="addUser">
    <input
      type="text"
      name="username"
      id="username"
      placeholder="Username"
      v-model="addedUsername"
    />
    <button>Add user</button>
  </form>

  <Timeline></Timeline>
</template>

<script>
import Timeline from "../components/Timeline.vue";

import { computed, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import { doc, setDoc, getDoc, getFirestore } from "@firebase/firestore";

export default {
  name: "HomeView",
  components: {
    Timeline,
  },
  setup() {
    const store = useStore();
    const db = getFirestore();

    const userAccount = computed(() => store.state.user);

    const addedUsername = ref("");
    const addUser = async () => {
      const userInfo = {
        friends: [],
        username: addedUsername.value,
      };

      try {
        await setDoc(doc(db, "users", userAccount.value.uid), userInfo);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    };
    return { userAccount, addedUsername, addUser };
  },
};
</script>
