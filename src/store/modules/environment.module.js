const EnvironmentStore = {
  namespaced: true,
  state: {
    params: null,
  },
  mutations: {
    setParams(state, data) {
      console.log(state);
      state.params = data;
    },
  },
};

export default EnvironmentStore;
