<template>
  <v-layout>
    <v-flex d-flex flex xs12 fill-height>
      <!-- LEFT COLUMN -->
      <div style="width:18vw"></div>
      <!-- CENTER COLUMN -->
      <v-layout xs4 column wrap class="full-height-flex-column">
        <v-flex style="flex:1"></v-flex>
        <v-flex style="flex:1; style:padding:5px; text-align:center">
          <H1 :key="existingPlayerId">{{existingPlayerId}}</H1>
        </v-flex>
        <v-flex style="flex:2; style:padding:5px; text-align:center">
          <div>
            <v-text-field placeholder="Player Name" v-model="playerName"></v-text-field>
          </div>
          <div>
            <v-btn v-bind:disabled="!playerName" v-on:click="newGame()">New</v-btn>
          </div>
          <div>
            <v-btn
              v-bind:disabled="playerName || !existingPlayerId"
              v-on:click="continueGame()"
            >Continue</v-btn>
          </div>
          <div>
            <v-btn v-bind:disabled="!existingPlayerId" v-on:click="quitGame()">Quit</v-btn>
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
import ClientPlayer from '../classes/clientPlayer.class';
import _ from 'lodash';
export default {
  name: 'Home',
  data: function () {
    return {
      msg: 'hello',
      playerName: null,
      remotePeerId: 'alphabetsoup',
    };
  },
  components: {},
  computed: {
    peerId() {
      return _.get(window, 'GameEngine.Networking.peer.id');
    },
    existingPlayerId() {
      return this.$store.state.player.id;
    },
  },
  created() {
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
  beforeDestroy() {},
  methods: {
    newGame: async function () {
      this.$store.dispatch('resetGame');

      window.GameEngine.Environment = null;
      window.GameEngine.Player = null;

      await this.initializePlayer();
      this.$router.replace('WorldExplorer');
    },
    quitGame: async function () {
      this.$store.dispatch('resetGame');

      window.GameEngine.Environment = null;
      window.GameEngine.Player = null;
    },
    continueGame: async function () {
      await this.initializePlayer();
      this.$router.replace('WorldExplorer');
    },
    async initializePlayer() {
      let playerRequest = {
        name: this.playerName,
      };

      if (this.$store.state.player.id) {
        playerRequest = {
          id: this.$store.state.player.id,
        };
      }

      console.log(playerRequest);

      let player = new ClientPlayer(playerRequest);

      await player.syncFromServer();
      console.log(player);
      if (player.id) {
        this.$store.commit('player/setId', player.id);
      }

      window.GameEngine.Player = player;
    },

    hostGame: function () {
      window.GameEngine.Networking.startHosting();
    },
    endGame: function () {
      window.GameEngine.Networking.endHosting();
    },
    joinGame: function () {
      window.GameEngine.Networking.joinHost(this.remotePeerId);
    },
    sendMessage: function () {
      window.GameEngine.Networking.send(this.msg);
    },
  },
};
</script>

<style scoped>
</style>
