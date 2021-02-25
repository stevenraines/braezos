import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';

import PlayerModule from './modules/player.module';
import EnvironmentModule from './modules/environment.module';
import ItemsModule from './modules/item.module';
Vue.use(VueAxios, axios);
Vue.use(Vuex);

const defaultState = {};

let store = new Vuex.Store({
  state: {},
  getters: {},
  mutations: {
    resetStore(state) {
      this.replaceState(defaultState);
      localStorage.setItem('store', JSON.stringify(state));
    },
  },
  actions: {
    async init({ state }) {
      if (localStorage.getItem('store')) {
        this.replaceState(
          Object.assign(state, JSON.parse(localStorage.getItem('store')))
        );
      }
    },
    async resetGame({ commit }) {
      commit('resetStore');
    },
  },
  modules: {
    player: PlayerModule,
    environment: EnvironmentModule,
    item: ItemsModule,
  },
});

store.subscribe(() => {
  localStorage.setItem('store', JSON.stringify(store.state));
});

export default store;
