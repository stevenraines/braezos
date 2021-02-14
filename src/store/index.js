import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';

import PlacesModule from './modules/places.module';
import PlayerModule from './modules/player.module';
import EnvironmentModule from './modules/environment.module';
Vue.use(VueAxios, axios);
Vue.use(Vuex);

const defaultState = {};

let store = new Vuex.Store({
  state: {},
  getters: {},
  mutations: {
    resetStore(state, defaultLocation) {
      console.log('resetStore');
      defaultState.location = defaultLocation;
      this.replaceState(Object.assign(state, defaultState));
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
  },
  modules: {
    player: PlayerModule,
    places: PlacesModule,
    environment: EnvironmentModule,
  },
});

store.subscribe(() => {
  localStorage.setItem('store', JSON.stringify(store.state));
});

export default store;
