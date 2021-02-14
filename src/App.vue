<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center"></div>
      <v-spacer></v-spacer>
      <v-btn v-on:click="newGame()">New Game</v-btn>
      <v-btn v-on:click="newMap()">New Map</v-btn>
    </v-app-bar>
    <v-main>
      <Home :key="homekey" />
    </v-main>
  </v-app> </template
>ß
<script>
import Home from './views/Home';
import { EventBus } from './eventbus.js';

export default {
  name: 'App',
  data: function() {
    return {
      homekey: 0,
    };
  },
  components: {
    Home,
  },
  created: function() {
    window.addEventListener('keyup', this.keyup);
  },
  beforeDestroy: function() {
    window.removeEventListener('keyup', this.keyup);
  },
  methods: {
    keyup: async function(event) {
      if (
        event.srcElement.tagName != 'TEXTAREA' &&
        event.srcElement.tagName != 'INPUT'
      ) {
        EventBus.$emit('keyevent', event);
      }
    },

    newGame: async function() {
      await this.$store.dispatch('resetGame');
      this.homekey += 1;
    },
    newMap: async function() {
      await this.$http.get('/api/makeMap');
    },
  },
  async beforeCreate() {
    await this.$root.$data.controllers.PlaceController.setup();
    await this.$root.$data.controllers.PlayerController.setup();
    await this.$root.$data.controllers.EnvironmentController.setup();
    EventBus.$emit('setupComplete', { success: true });
  },
};
</script>
<style>
.section-border {
  border: 1px solid #000000;
  overflow: auto;
}
</style>
