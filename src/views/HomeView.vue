<template>
  <p v-if="userAccount">Trenutni korisnik je {{ userAccount.email }}</p>
  <p v-if="userAccount">Vaš ID je {{ userAccount.uid }}</p>

  <form @submit.prevent="addUser">
    <input
      type="text"
      name="userId"
      id="userId"
      placeholder="Friend's ID"
      v-model="userId"
    />
    <button>Add user</button>
  </form>

  <Timeline></Timeline>
</template>

<script>
import Timeline from "../components/Timeline.vue";

import { computed, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import {
  doc,
  setDoc,
  getDoc,
  getFirestore,
  updateDoc,
  arrayUnion,
} from "@firebase/firestore";

export default {
  name: "HomeView",
  components: {
    Timeline,
  },
  setup() {
    const store = useStore();
    const db = getFirestore();

    const userAccount = computed(() => store.state.user);

    const userId = ref("");
    const addUser = async () => {
      try {
        const docSnap = await getDoc(doc(db, "users", userId.value));
        if (docSnap.exists()) {
          //ako trazeni user postoji:
          console.log("Document data:", docSnap.data());

          await updateDoc(doc(db, "users", userAccount.value.uid), {
            friends: arrayUnion(userId.value),
          });
          store.commit("pushFriendToArray", userId.value);
          alert("Prijatelj dodan!");
        } else {
          // doc.data() will be undefined in this case
          console.log("User with that ID doesn't exist!");
        }
      } catch (e) {
        console.error("Error reading document: ", e);
      }
    };
    return { userAccount, userId, addUser };
  },
};
</script>
