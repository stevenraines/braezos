import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { EventBus } from './eventbus.js';
import PlaceController from './controllers/placeController';
import PlayerController from './controllers/playerController';
import EnvironmentController from './controllers/environmentController';
import ItemsController from './controllers/itemsController';
import InputController from './controllers/inputController';
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
      controllers: {
        PlaceController: null,
        PlayerController: null,
        EnvironmentController: null,
        InputController: null,
      },
    };
  },
  async created() {
    this.controllers.PlaceController = new PlaceController(this.$root);
    this.controllers.PlayerController = new PlayerController(this.$root);
    this.controllers.EnvironmentController = new EnvironmentController(
      this.$root,
      params
    );
    this.controllers.ItemsController = new ItemsController(this.$root);
    this.controllers.InputController = new InputController();
    await this.$store.dispatch('init');
  },
}).$mount('#app');

window.postMessage = function(event, msg) {
  if (event && msg.event) {
    console.log(msg.event, msg);
    EventBus.$emit(msg.event, msg);

    if (event.stopPropagation) event.stopPropagation();
  }
};
