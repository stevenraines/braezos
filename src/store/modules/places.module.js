const PlaceStore = {
  namespaced: true,
  state: {
    terrain: null,
  },
  getters: {},
  mutations: {
    updateTerrain(state, terrain) {
      state.terrain = terrain;
    },
  },
  actions: {},
};

export default PlaceStore;
