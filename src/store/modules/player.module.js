import { EventBus } from '../../eventbus.js';
import helpers from '../../globalhelpers.js';
const Delaunay = require('d3-delaunay').Delaunay;

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
    setupPlayer(state, data) {
      if (data) {
        state.location = data.location;
        state.position = data.location.point;
        return;
      }
    },
    updatePlayerLocation(state, location) {
      if (location) {
        state.location = location;
        state.position = location.point;
        return;
      }
    },
    updatePlayerPosition(state, newPosition) {
      state.position = newPosition;
      // let oldPosition = state.position;
      // update the position
      // find what place the new player position is in
    },
  },
  actions: {
    async init({ commit, rootState }) {
      commit('setupPlayer', {
        location: rootState.places.cells[rootState.places.startingCellIndex],
      });
    },
    async movePlayerSmall({ state, commit, rootState }, positionVector) {
      let newPosition = helpers.cleanObservable(state.position);
      let newLocation = helpers.cleanObservable(state.location);
      newPosition[0] = newPosition[0] + positionVector[0];
      newPosition[1] = newPosition[1] + positionVector[1];

      let delaunay = Delaunay.from(rootState.places.points);
      let voronoi = delaunay.voronoi([0, 0, 800, 800]);

      for (let cell in rootState.places.cells) {
        if (
          voronoi.contains(
            rootState.places.cells[cell].id,
            newPosition[0],
            newPosition[1]
          )
        ) {
          newLocation = rootState.places.cells[cell];
          if (newLocation.terrainType.name == 'ocean') {
            return;
          }

          await commit('updatePlayerLocation', newLocation);
          break;
        }
      }

      await commit('updatePlayerPosition', newPosition);
      EventBus.$emit('playerMoved', state.location);
    },
    async movePlayer({ state, commit }, newLocation) {
      if (state.location && newLocation.id == state.location.id) return;

      await commit('updatePlayerLocation', newLocation);

      EventBus.$emit('playerMoved', newLocation);
    },
  },
};

export default PlayerManager;
