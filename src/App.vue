<template>
  <v-app>
    <div>
      <p v-if="isConnected">connected to the server!</p>
      <p>Message: "{{socketMessage}}"</p>
      <v-btn @click="pingServer()">Ping Server</v-btn>
    </div>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
<script>
import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';
const socketOptions = {
  path: '/ws/',
  transport: ['websocket'],
  origins: 'localhost:*',
  withCredentials: true,
};

const connection = `${location.protocol}//${location.host.split(':')[0]}:8081`;
console.log(connection);

Vue.use(
  new VueSocketIO({
    connection: SocketIO(connection, socketOptions), //options object is Optional
    debug: true,
  })
);

import { EventBus } from './eventbus.js';

export default {
  name: 'App',
  data: function () {
    return {
      homekey: 0,
      isConnected: false,
      socketMessage: '',
    };
  },
  sockets: {
    connect() {
      // Fired when the socket connects.
      this.isConnected = true;
    },

    disconnect() {
      this.isConnected = false;
    },
    message: function (data) {
      console.log(
        'this method was fired by the socket server. eg: io.emit("message", data)',
        data
      );
    },
  },
  components: {},
  async beforeCreate() {},
  async created() {
    console.log(`${location.protocol}//${location.host}`);
    window.addEventListener('keyup', this.keyup);
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.keyup);
  },
  methods: {
    pingServer() {
      // Send the "pingServer" event to the server.
      this.$socket.emit('message', 'PING!');
    },
    keyup: async function (event) {
      EventBus.$emit('keyevent', {
        controllers: this.$root.$data.controllers,
        event: event,
      });
    },
    newGame: async function () {
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
