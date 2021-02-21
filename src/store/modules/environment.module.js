const EnvironmentStore = {
  namespaced: true,
  state: {
    singleton: true,
    params: null,
  },
  mutations: {
    setParams(state, data) {
      state.params = data;
    },
  },
};

export default EnvironmentStore;
