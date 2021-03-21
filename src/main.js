import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { EventBus } from './eventbus.js';
import EventManager from '././classes/eventManager.class';

import Networking from './classes/networking.class';

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  data: function() {
    return {
      World: null,
      Renderer: null,
      Networking: null,
      Player: null,
      Environment: null,
      EventManager: null,
    };
  },

  async created() {
    // assign a blobal object that classes can use.
    window.GameEngine = this;

    // instantiate core classes

    this.Networking = new Networking();
    this.EventManager = new EventManager();
    // load any existing state
    await this.$store.dispatch('init');
  },
  methods: {
    log(message, type) {
      EventBus.$emit('log', { type: type, message: message });
      console.info(message);
    },
    cleanObservable: function(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
  },
}).$mount('#app');
