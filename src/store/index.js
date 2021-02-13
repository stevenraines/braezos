import { EventBus } from '../eventbus.js';

import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';

import PlacesModule from './modules/places.module';
import PlayerModule from './modules/player.module';

Vue.use(VueAxios, axios);
Vue.use(Vuex);

const defaultState = {
  location: {
    id: 'none',
    encounter: {
      items: [],
    },
  },
};

let store = new Vuex.Store({
  state: {},
  getters: {},
  mutations: {
    resetStore(state, defaultLocation) {
      defaultState.location = defaultLocation;
      this.replaceState(Object.assign(state, defaultState));
      localStorage.setItem('store', JSON.stringify(state));
    },
  },
  actions: {
    async init({ state, dispatch }) {
      if (localStorage.getItem('storeX')) {
        // Replace the state object with the stored item
        this.replaceState(
          Object.assign(state, JSON.parse(localStorage.getItem('store')))
        );
        console.log(state);
      } else {
        await dispatch('places/init');
        await dispatch('player/init');
      }

      console.log('DONE.. emitting 2 s');
      EventBus.$emit('setupComplete', { success: true });
    },
  },
  modules: {
    player: PlayerModule,
    places: PlacesModule,
  },
});

store.subscribe((mutation, state) => {
  localStorage.setItem('store', JSON.stringify(state));
});

export default store;
