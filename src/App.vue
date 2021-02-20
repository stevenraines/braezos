<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center"></div>
      <v-spacer></v-spacer>
      <v-btn v-on:click="newGame()">New Game</v-btn>
    </v-app-bar>
    <v-main>
      <Home :key="homekey" />
    </v-main>
  </v-app>
</template>
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
  async beforeCreate() {
    await this.$root.$data.controllers.EnvironmentController.setup();
    await this.$root.$data.controllers.PlaceController.setup();
    await this.$root.$data.controllers.ItemsController.setup();
    await this.$root.$data.controllers.PlayerController.setup();
  },
  created() {
    window.addEventListener('keyup', this.keyup);
    EventBus.$emit('setupComplete', { success: true });
    this.homekey += 1;
  },
  mounted() {},
  beforeDestroy() {
    window.removeEventListener('keyup', this.keyup);
  },
  methods: {
    keyup: async function(event) {
      EventBus.$emit('keyevent', {
        controllers: this.$root.$data.controllers,
        event: event,
      });
    },
    newGame: async function() {
      await this.$store.dispatch('resetGame');
      window.location.reload();
    },
  },
};
</script>
<style>
.section-border {
  border: 1px solid #000000;
  overflow: auto;
}
</style>
