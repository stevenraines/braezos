import VuexReset from '@ianwalter/vuex-reset';

const EnvironmentStore = {
  plugins: [VuexReset()],
  namespaced: true,
  state: {
    singleton: true,
    params: null,
  },
  mutations: {
    reset: () => {},
    setParams(state, data) {
      state.params = data;
    },
    saveState(state, data) {
      delete data.storeName;
      for (const [key, value] of Object.entries(data)) {
        state[key] = value;
      }
    },
  },
};

export default EnvironmentStore;
