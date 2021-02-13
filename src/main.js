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

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  data: function() {
    return {
      PlaceController: new PlaceController(this.$store),
      PlayerController: new PlayerController(this.$store),
    };
  },
  created() {},
}).$mount('#app');

window.postMessage = function(event, msg) {
  if (event && msg.event) {
    console.log(msg.event, msg);
    EventBus.$emit(msg.event, msg);

    if (event.stopPropagation) event.stopPropagation();
  }
};
