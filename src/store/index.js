import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    location: { cellIndex: "none" },
  },
  mutations: {
    setCurrentLocation: (state, data) => {
      // mutate state
      state.location = data;
    },
  },
  actions: {},
  modules: {},
});
