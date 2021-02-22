import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { EventBus } from './eventbus.js';

import Environment from './classes/environment.class';
import Player from './classes/things/actors/player.class';
import Input from './classes/input.class';
import params from '../params.config';

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  data: function() {
    return {
      Player: null,
      Environment: null,
      Input: null,
    };
  },

  async created() {
    // assign a blobal object that classes can use.
    window.GameEngine = this;

    // instantiate core classes
    this.Player = new Player();
    this.Input = new Input();
    this.Environment = new Environment(params);

    // load any existing state
    await this.$store.dispatch('init');

    // broadcast set-up complete message to components
    EventBus.$emit('setupComplete', { success: true });
  },
  methods: {
    log(message, type) {
      EventBus.$emit('log', { type: type, message: message });
      console.log(message);
    },
    cleanObservable: function(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
  },
}).$mount('#app');

window.postMessage = function(event, msg) {
  if (event && msg.event) {
    window.GameEngine.log({ msg: msg, event: event });
    EventBus.$emit(msg.event, msg);

    if (event.stopPropagation) event.stopPropagation();
  }
};
