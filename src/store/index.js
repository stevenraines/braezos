import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';

import PlayerModule from './modules/player.module';
import ActorModule from './modules/actor.module';
import EnvironmentModule from './modules/environment.module';
import ItemsModule from './modules/item.module';
import StructureModule from './modules/structure.module';
import VuexReset from '@ianwalter/vuex-reset';

Vue.use(VueAxios, axios);
Vue.use(Vuex);

const gameDataLSName = 'gameData';

let store = new Vuex.Store({
  plugins: [VuexReset()],
  state: {},
  getters: {},
  mutations: {
    reset: () => {},
  },
  actions: {
    async init({ state }) {
      if (localStorage.getItem(gameDataLSName)) {
        this.replaceState(
          Object.assign(state, JSON.parse(localStorage.getItem(gameDataLSName)))
        );
      }
    },
    async resetGame({ dispatch, commit }) {
      commit('reset');
      commit('actor/reset');
      commit('item/reset');
      commit('environment/reset');
      dispatch('init');
    },
  },
  modules: {
    player: PlayerModule,
    actor: ActorModule,
    environment: EnvironmentModule,
    item: ItemsModule,
    structure: StructureModule,
  },
});

store.subscribe(() => {
  localStorage.setItem(gameDataLSName, JSON.stringify(store.state));
});

export default store;
