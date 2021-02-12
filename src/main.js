import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { EventBus } from './eventbus.js';

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');

window.postMessage = function(event, msg) {
  if (event && msg.event) {
    console.log(msg.event, msg);
    EventBus.$emit(msg.event, msg);

    if (event.stopPropagation) event.stopPropagation();
  }
};
