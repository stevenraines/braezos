import Vue from 'vue';
import VueRouter from 'vue-router';
import Sample from '../views/Sample.vue';
import Home from '../views/Home.vue';
import Game from '../views/Game.vue';
import Generate from '../views/Generate.vue';
import CreateCharacter from '../views/CreateCharacter.vue';
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/generate',
    name: 'Generate',
    component: Generate,
  },
  {
    path: '/createcharacter',
    name: 'CreateCharacter',
    component: CreateCharacter,
  },
  {
    path: '/game',
    name: 'Game',
    component: Game,
  },
  {
    path: '/sample',
    name: 'Sample',
    component: Sample,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
