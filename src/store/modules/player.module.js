import { EventBus } from '../../eventbus.js';

const PlayerManager = {
  namespaced: true,
  state: {
    location: null,
    position: {
      x: 0,
      y: 0,
    },
    hp: null, // the current place where the player is
  },
  getters: {},
  mutations: {
    updatePlayerLocation(state, location) {
      state.location = location;
    },
    updatePlayerPosition(state, newPosition) {
      state.position = newPosition;
    },
  },
  actions: {
    async movePlayer({ state, commit }, data) {
      if (data.location) {
        await commit('updatePlayerLocation', data.location);
      }
      if (data.position) {
        await commit('updatePlayerPosition', data.position);
      }

      EventBus.$emit('playerMoved', state.location);
    },
  },
};

export default PlayerManager;
