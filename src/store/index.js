import { createStore } from "vuex";

export default createStore({
  state: {
    user: null,
    authIsReady: false,
    friends: [],
    selectedDay: 1,
  },
  getters: {},
  mutations: {
    setUser(state, payload) {
      state.user = payload;
      console.log("setUser(): ", state.user);
    },
    setFriends(state, payload) {
      state.friends = payload;
      console.log("Friend list: ", state.friends);
    },
    pushFriendToArray(state, payload) {
      state.friends.push(payload);
      console.log("Friend list: ", state.friends);
    },
    setSelectedDay(state, payload) {
      state.selectedDay = payload;
      console.log("day changed: ", state.selectedDay);
    },
  },
  actions: {},
  modules: {},
});
