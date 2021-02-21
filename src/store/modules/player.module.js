import { EventBus } from '../../eventbus.js';

const PlayerManager = {
  namespaced: true,
  state: {
    viewDistance: 8,
    position: {
      x: null,
      y: null,
      d: 0,
    },
    hp: null, // the current place where the player is
  },
  getters: {},
  mutations: {
    updatePlayerPosition(state, newPosition) {
      state.position = newPosition;
    },
    saveState(state, data) {
      delete data.storeName;
      for (const [key, value] of Object.entries(data)) {
        state[key] = value;
      }
    },
  },
  actions: {
    async movePlayer({ state, commit }, data) {
      if (data.position) {
        await commit('updatePlayerPosition', data.position);
      }

      EventBus.$emit('playerMoved', state.location);
    },
  },
};

export default PlayerManager;
