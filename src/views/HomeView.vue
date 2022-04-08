<template>
  <p v-if="userAccount">Trenutni korisnik je {{ userAccount.email }}</p>
</template>

<script>
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import { collection, getDocs, getFirestore } from "@firebase/firestore";

export default {
  name: "HomeView",
  setup() {
    const store = useStore();
    const db = getFirestore();

    const userAccount = computed(() => store.state.user);
    const getSnapshot = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().username}`);
      });
    };
    getSnapshot();
    return { userAccount };
  },
};
</script>
