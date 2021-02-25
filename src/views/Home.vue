<template>
  <v-layout fill-height>
    <v-flex d-flex flex x12 class="db-1">
      <h1>Title</h1>
    </v-flex>
  </v-layout>
  <!--
  <v-container fluid grid-list-md box class="db-1">
    <v-layout row>
      <v-flex d-flex xs3>
        <v-layout row wrap>
          <v-card color="orange lighten-2" tile flat>
            <v-card-text>
              Join a Game
              <v-text-field v-model="remotePeerId" />
              <v-btn v-on:click="joinGame()">Join Game</v-btn>
            </v-card-text>
          </v-card>

          <v-divider></v-divider>

          <v-card color="orange lighten-2" tile flat>
            <v-card-text> {{ peerId }}</v-card-text>
          </v-card>

          <v-divider></v-divider>

          <v-card color="orange lighten-2" tile flat>
            <v-card-text>
              <v-text-field v-model="msg" />
              <v-btn v-on:click="sendMessage()"
                >send Message</v-btn
              ></v-card-text
            >
          </v-card>

          <v-divider></v-divider>

          <v-card color="orange lighten-2" tile flat>
            <v-card-text>X</v-card-text>
          </v-card>
        </v-layout>
      </v-flex>

      <v-flex d-flex xs9>
        <v-layout row wrap>
          <v-layout row>
            <v-flex d-flex>
              <v-card color="blue-grey" dark tile flat>
                <v-card-text>{{ lorem }}</v-card-text>
              </v-card>
            </v-flex>

            <v-flex d-flex>
              <v-card color="blue-grey" dark tile flat>
                <v-card-text>{{ lorem }}</v-card-text>
              </v-card>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex d-flex xs9>
              <v-card color="blue-grey" dark tile flat>
                <v-card-text>{{ lorem }}</v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-flex>
    </v-layout>
    -->

  <!--
  <v-container fluid fill-height class="db-1">
 
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center"></div>
      <v-spacer></v-spacer>
   
      <v-btn v-if="!peerId" v-on:click="hostGame()">Host Game</v-btn>
      <v-btn v-if="peerId" v-on:click="endGame()">End Game</v-btn>
      <v-spacer />
      <v-btn v-on:click="newGame()">New Game</v-btn>
    </v-app-bar>
 
    <v-row fill-height class=".flex-column db-2">
      <v-col>
        <h1>Title</h1>

       

        <v-card>
      
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  -->
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

<style scoped></style>
