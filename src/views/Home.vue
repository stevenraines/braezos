<template>
  <v-layout>
    <v-flex d-flex flex xs12 fill-height>
      <!-- LEFT COLUMN -->
      <div style="width:20vw"></div>
      <!-- CENTER COLUMN -->
      <v-layout xs4 column wrap class="full-height-flex-column">
        <v-flex style="flex:1"></v-flex>
        <v-flex style="flex:1; style:padding:5px; text-align:center">
          <H1>Title</H1>
        </v-flex>
        <v-flex style="flex:2; style:padding:5px; text-align:center">
          <div>
            <v-btn v-on:click="newGame()">New</v-btn>
          </div>
          <div>
            <v-btn v-on:click="continueGame()">Continue</v-btn>
          </div>
          <div>
            <v-btn disabled v-on:click="continueGame()">Load</v-btn>
          </div>
          <hr />
          <div></div>
        </v-flex>
        <v-flex style="flex:1"></v-flex>
      </v-layout>

      <!-- RIGHT COLUMN -->
      <div style="width:20vw"></div>
    </v-flex>
  </v-layout>
</template>

<script>
import { EventBus } from '../eventbus.js';
import _ from 'lodash';
export default {
  name: 'Home',
  data: function() {
    return {
      msg: 'hello',
      remotePeerId: 'alphabetsoup',
    };
  },
  components: {},
  computed: {
    peerId() {
      return _.get(window, 'GameEngine.Networking.peer.id');
    },
  },
  created() {
    EventBus.$on('GameStateReset', this.continueGame);
    /*
    EventBus.$on('clientRegister', function(data) {
      console.log(`clientRegistered. Id:`, data);
    });
    EventBus.$on('clientData', function(data) {
      console.log(`receivedData from ${data.clientId}`, data);
    });
    EventBus.$on('serverData', function(data) {
      console.log(`receivedData from server`, data);
    });
  */
  },
  beforeDestroy() {
    EventBus.$off('GameStateReset', this.continueGame);
  },
  methods: {
    newGame: function() {
      window.GameEngine.Environment = null;
      window.GameEngine.Player = null;
      this.$store.dispatch('resetGame');
    },
    continueGame: function() {
      console.log('continue game');

      window.setTimeout(
        function() {
          this.$router.push('Generate');
        }.bind(this),
        1000
      );
    },
    hostGame: function() {
      window.GameEngine.Networking.startHosting();
    },
    endGame: function() {
      window.GameEngine.Networking.endHosting();
    },
    joinGame: function() {
      window.GameEngine.Networking.joinHost(this.remotePeerId);
    },
    sendMessage: function() {
      window.GameEngine.Networking.send(this.msg);
    },
  },
};
</script>

<style scoped></style>
