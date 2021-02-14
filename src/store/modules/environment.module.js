const EnvironmentStore = {
  namespaced: true,
  state: {
    params: null,
  },
  mutations: {
    setParams(state, data) {
      state.params = data;
    },
  },
};

export default EnvironmentStore;
