<template>
  <p v-if="userAccount">Trenutni korisnik je {{ userAccount.email }}</p>
</template>

<script>
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
export default {
  name: "HomeView",
  setup() {
    const store = useStore();

    const userAccount = computed(() => {
      return store.state.user;
    });

    return { userAccount };
  },
};
</script>
