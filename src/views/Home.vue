<template>
  <v-container fluid fill-height>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center"></div>
      <v-spacer></v-spacer>
      {{ peerId }}
      <v-btn v-if="!peerId" v-on:click="hostGame()">Host Game</v-btn>
      <v-btn v-if="peerId" v-on:click="endGame()">End Game</v-btn>
      <v-spacer />
      <v-btn v-on:click="newGame()">New Game</v-btn>
    </v-app-bar>
    <v-row fill-height>
      <v-col>
        <v-card>
          Join a Game
          <v-text-field v-model="remotePeerId" />
          <v-btn v-on:click="joinGame()">Join Game</v-btn>
        </v-card>

        <v-card>
          <v-text-field v-model="msg" />
          <v-btn v-on:click="sendMessage()">send Message</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
    EventBus.$on('clientRegister', function(data) {
      console.log(`clientRegistered. Id:`, data);
    });
    EventBus.$on('clientData', function(data) {
      console.log(`receivedData from ${data.clientId}`, data);
    });
    EventBus.$on('serverData', function(data) {
      console.log(`receivedData from server`, data);
    });
  },
  methods: {
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

<style></style>
