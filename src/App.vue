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
html {
  width: 99vw;
  height: 100vh;
  overflow: hidden;
  overscroll-behavior-y: contain;
}

body {
  overscroll-behavior-y: contain;
  width: 99vw;
  height: 100vh;
  overscroll-behavior: contain;
  overflow: hidden;
  scrollbar-width: none; /* Firefox */
  background-color: #1d1d1d;
}

div.layout {
  margin: 0px;
  padding: 0px;
}
.bar {
  overflow: hidden;
  max-height: 100vh;
  max-width: 99vw;
  background-color: #6d6d6d;
}

/* any full height column needs to have this or the scrolling divs won't work right */
.full-height-flex-column {
  height: 100vh;
}

.scroll {
  overflow: auto;
}

.db-1 {
  border: 1px solid #ff0000;
}

.db-2 {
  border: 2px solid #0000ff;
}

.db-3 {
  border: 1px solid #00ff00;
}
</style>
