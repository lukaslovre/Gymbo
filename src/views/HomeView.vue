<template>
  <p v-if="userEmail">Trenutni korisnik je {{ userEmail.email }}</p>
</template>

<script>
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
export default {
  name: "HomeView",
  setup() {
    const store = useStore();

    const userEmail = computed(() => {
      return store.state.user;
    });

    return { userEmail };
  },
};
</script>
