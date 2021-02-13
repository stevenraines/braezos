import { EventBus } from '../../eventbus.js';
import helpers from '../../globalhelpers.js';
const Delaunay = require('d3-delaunay').Delaunay;

function normalizePosition(position, gridSize) {
  let newX = Math.floor(position[0] / gridSize) * gridSize;
  let newY = Math.floor(position[1] / gridSize) * gridSize;
  position = [
    newX < 0 ? -1 : (1 * gridSize) / 2 + newX,
    newY < 0 ? -1 : (1 * gridSize) / 2 + newY,
  ];

  return position;
}
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
    updatePlayerLocation(state, data) {
      if (location) {
        state.location = data.location;
        state.position = data.position;
        return;
      }
    },
    updatePlayerPosition(state, newPosition) {
      state.position = newPosition;
    },
  },
  actions: {
    async init({ dispatch, rootState }) {
      dispatch('setupPlayer', {
        location: rootState.places.cells[rootState.places.startingCellIndex],
      });
    },
    async setupPlayer({ commit, rootState }, data) {
      if (data) {
        let newPosition = normalizePosition(
          data.location.point,
          rootState.places.params.moveSize
        );

        await commit('updatePlayerLocation', {
          location: location,
          position: newPosition,
        });
      }
    },
    async movePlayerSmall({ state, commit, rootState }, positionVector) {
      let newPosition = helpers.cleanObservable(state.position);
      let newLocation = helpers.cleanObservable(state.location);
      newPosition[0] = newPosition[0] + positionVector[0];
      newPosition[1] = newPosition[1] + positionVector[1];

      let delaunay = Delaunay.from(rootState.places.points);
      let voronoi = delaunay.voronoi([
        0,
        0,
        rootState.places.params.width,
        rootState.places.params.height,
      ]);

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

          break;
        }
      }

      newPosition = normalizePosition(
        newPosition,
        rootState.places.params.moveSize
      );

      await commit('updatePlayerLocation', {
        location: newLocation,
        position: newPosition,
      });

      EventBus.$emit('playerMoved', state.location);
    },
    async movePlayer({ state, commit, rootState }, newLocation) {
      if (state.location && newLocation.id == state.location.id) return;
      let newPosition = normalizePosition(
        newLocation.point,
        rootState.places.params.moveSize
      );

      await commit('updatePlayerLocation', {
        location: newLocation,
        position: newPosition,
      });

      EventBus.$emit('playerMoved', newLocation);
    },
  },
};

export default PlayerManager;
