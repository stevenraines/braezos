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

    setPlayer(state, player) {
      state.id = player.id;
      state.name = player.name;
    },
  },
};

export default PlayerStore;
