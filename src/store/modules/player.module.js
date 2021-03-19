import VuexReset from '@ianwalter/vuex-reset';

const PlayerStore = {
  plugins: [VuexReset()],
  namespaced: true,
  state: {
    singleton: true,
    params: null,
  },
  mutations: {
    reset: () => {},

    setId(state, id) {
      state.id = id;
    },
  },
};

export default PlayerStore;
