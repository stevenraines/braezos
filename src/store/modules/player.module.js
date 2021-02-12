import { EventBus } from '../../eventbus.js';

const PlayerManager = {
  namespaced: true,
  state: {
    location: null,
    hp: null, // the current place where the player is
  },
  getters: {},
  mutations: {
    setupPlayer(state, data) {
      if (data) {
        state.location = data.location;
        return;
      }
    },
    updatePlayerLocation(state, location) {
      if (location) {
        state.location = location;
        return;
      }
    },
  },
  actions: {
    async init({ commit, rootState }) {
      console.log('player init');
      console.log(
        rootState.places.startingCellIndex,
        rootState.places.cells[rootState.places.startingCellIndex]
      );
      commit('setupPlayer', {
        location: rootState.places.cells[rootState.places.startingCellIndex],
      });
    },
    async movePlayer({ state, commit }, newLocation) {
      if (state.location && newLocation.id == state.location.id) return;

      /*
      if (state.location.encounter.state == EncounterStates.START) {
        state.location.encounter.state = EncounterStates.VISITED;
      }
*/

      await commit('updatePlayerLocation', newLocation);

      EventBus.$emit('playerMoved', newLocation);
    },
  },
};

export default PlayerManager;
