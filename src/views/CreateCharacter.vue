<template>
  <v-layout>
    <v-flex d-flex flex xs12 fill-height>
      <!-- LEFT COLUMN -->
      <div style="width:20vw"></div>
      <!-- CENTER COLUMN -->
      <v-layout xs4 column wrap class="full-height-flex-column">
        <v-flex style="flex:1"></v-flex>
        <v-flex style="flex:1; style:padding:5px; text-align:center">
          <H1>Create Character</H1>

          <div>
            <v-btn v-on:click="startGame()">Start</v-btn>
          </div>
        </v-flex>
        <v-flex style="flex:2; style:padding:5px; text-align:center">
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
import Player from 'shared/classes/things/actors/player.class';
export default {
  name: 'CreateCharacter',
  data: function () {
    return {};
  },
  components: {},
  computed: {},

  created() {
    if (!window.GameEngine.Environment) return this.$router.replace('Generate');

    if (window.GameEngine.Player) return this.startGame();

    window.GameEngine.Player = Player.getUsersPlayer();

    if (!window.GameEngine.Player) {
      window.GameEngine.Player = new Player({
        name: 'player1',
        position: window.GameEngine.Environment.level.startingCell.position,
      });

      window.GameEngine.Player.save();
      return;
    }

    return this.$router.push('Game');
  },

  methods: {
    startGame: function () {
      this.$router.push('Game');
    },
  },
};
</script>

<style scoped></style>
