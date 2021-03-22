<template>
  <v-layout>
    <v-flex d-flex flex xs12 fill-height v-if="ready">
      <!-- LEFT COLUMN -->
      <div style="width:18vw"></div>
      <!-- CENTER COLUMN -->
      <v-layout xs4 column wrap class="full-height-flex-column">
        <v-flex style="flex:1"></v-flex>
        <v-flex style="flex:1; style:padding:5px; text-align:center">
          <H1 :key="existingPlayerName">{{existingPlayerName}}</H1>
        </v-flex>
        <v-flex style="flex:2; style:padding:5px; text-align:center">
          <div>
            <v-text-field placeholder="Player Name" v-model="playerName"></v-text-field>
          </div>
          <div>
            <v-btn v-bind:disabled="!playerName" v-on:click="newGame()">Connect</v-btn>
          </div>
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

export default {
  name: 'Home',
  data: function () {
    return {
      playerName: null,
      ready: false,
    };
  },
  components: {},
  computed: {
    existingPlayerName() {
      return this.$store.state.player.name;
    },
  },
  mounted() {
    if (!this.$store.state.player.name) {
      this.ready = true;
      return;
    }
  },

  beforeDestroy() {},
  sockets: {
    async connect() {
      if (this.$store.state.player.name) {
        await this.setupPlayer({
          name: this.$store.state.player.name,
          socketId: this.$socket.id,
        });
      }
    },
    disconnect() {
      this.isConnected = false;
      this.ready = true;
    },
    message: function (data) {
      console.info(
        'this method was fired by the socket server. eg: io.emit("message", data)',
        data
      );
    },
  },
  methods: {
    newGame: async function () {
      this.quitGame();
      await this.initializePlayer();
    },

    quitGame: async function () {
      this.$store.dispatch('resetGame');
      window.GameEngine.Environment = null;
      window.GameEngine.Player = null;
    },
    async initializePlayer() {
      await this.setupPlayer({
        name: this.playerName,
        socketId: this.$socket.id,
      });
    },

    async setupPlayer(playerRequest) {
      let player = new ClientPlayer(playerRequest);

      await player.syncFromServer();
      console.log(player, playerRequest);

      if (player.id) {
        this.$store.commit('player/setPlayer', {
          name: player.name,
        });
      }

      window.GameEngine.Player = player;

      if (player.isNew) {
        return this.$router.replace('CreateCharacter');
      }

      this.$router.replace('WorldExplorer');
    },
  },
};
</script>

<style scoped>
</style>
