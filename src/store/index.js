import { createStore } from "vuex";

export default createStore({
  state: {
    user: null,
    authIsReady: false,
  },
  getters: {},
  mutations: {
    setUser(state, payload) {
      state.user = payload;
      console.log("setUser(): ", state.user);
    },
    setAuthIsReady(state) {
      state.authIsReady = true;
    },
  },
  actions: {},
  modules: {},
});
