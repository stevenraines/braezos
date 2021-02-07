import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VueAxios from "vue-axios";
import EncounterStates from "../../shared/enums/encounterStates";

Vue.use(VueAxios, axios);
Vue.use(Vuex);

const defaultState = {
  location: { id: "none" },
};

let store = new Vuex.Store({
  state: {
    location: null,
  },
  getters: {
    normalState(state) {
      return JSON.parse(JSON.stringify(state));
    },
  },
  mutations: {
    setCurrentLocation: (state, data) => {
      // mutate state

      state.location = data;
    },

    resetStore(state, defaultLocation) {
      defaultState.location = defaultLocation;
      this.replaceState(Object.assign(state, defaultState));
      localStorage.setItem("store", JSON.stringify(state));
    },

    initialiseStore(state) {
      // Check if the ID exists

      if (localStorage.getItem("store")) {
        // Replace the state object with the stored item
        this.replaceState(
          Object.assign(state, JSON.parse(localStorage.getItem("store")))
        );
      } else {
        this.replaceState(Object.assign(state, defaultState));
      }
    },
  },
  actions: {
    async movePlayer({ commit, getters }, data) {
      // if we are leaving an encounter and the state is "Start", change it to visited
      let location = getters.normalState.location;

      if (location.encounter.state == EncounterStates.START) {
        location.encounter.state = EncounterStates.VISITED;
      }

      let newLocation = await (
        await axios.post(`/api/location/${data.toCell}`, location.encounter)
      ).data;

      commit("setCurrentLocation", newLocation);
      return true;
    },
    async resetGame({ commit }) {
      commit("resetStore", (await axios.post("/api/location/start")).data);
    },
  },
  modules: {},
});

store.subscribe((mutation, state) => {
  // Store the state object as a JSON string
  localStorage.setItem("store", JSON.stringify(state));
});

export default store;
