import axios from 'axios';

const PlaceStore = {
  namespaced: true,
  state: {
    cells: null,
    params: null,
    points: null,
    startingCellIndex: null,
    voronoi: null, // the current place where the player is
  },
  getters: {
    placeList(state) {
      return state.places;
    },
  },
  mutations: {
    updatePlaces(state, places) {
      state.cells = places.cells;
      state.points = places.points;
      state.startingCellIndex = places.startingCellIndex;
    },
    updateEncounters(state, encounters) {
      state.encounters = encounters;
    },
  },
  actions: {
    async init({ commit }) {
      let places = await axios.get('/api/places');

      commit('updatePlaces', places.data);
    },
  },
};

export default PlaceStore;
