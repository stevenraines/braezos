<template>
  <v-app>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
<script>
import { EventBus } from './eventbus.js';

export default {
  name: 'App',
  data: function() {
    return {
      homekey: 0,
    };
  },
  components: {},

  async beforeCreate() {},
  async created() {
    window.addEventListener('keyup', this.keyup);
  },
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
