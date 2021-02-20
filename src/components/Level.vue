<template>
  <v-flex d-flex child-flex>
    <v-card class="cc card">
      <img :src="this.renderedMapImg" />
    </v-card>
  </v-flex>
</template>

<script>
import { EventBus } from '../eventbus.js';
import Point from '../classes/point.class';
import MOVE_VECTORS from '../enums/moveVectors';

export default {
  name: 'Level',
  data: function() {
    return {
      level: null,
      levelIndex: 0,

      renderedMapImg: null,
    };
  },

  components: {},

  beforeCreate() {},
  created() {},
  mounted() {
    EventBus.$on('keyevent', this.handleKeyEvent);
    EventBus.$on('click', this.handleGlobalEvent);
    EventBus.$on('setupComplete', this.setupComplete);
    this.renderLevel();
  },
  methods: {
    setupComplete: function() {},
    renderLevel: async function() {
      this.level = this.$root.$data.controllers.EnvironmentController.getLevel(
        this.levelIndex
      );

      let player = this.$root.$data.controllers.PlayerController.player;
      let playerWorldCellPoint = new Point(player.playerWorldCell);
      this.renderedMapImg = this.level.renderLevelAsImgSrc(
        playerWorldCellPoint,
        {
          width: 400,
          height: 400,
        }
      );
    },

    handleKeyEvent: async function(message) {
      let vector = [0, 0];
      switch (message.code) {
        case 'ArrowUp':
          vector = MOVE_VECTORS.N;
          break;
        case 'ArrowDown':
          vector = MOVE_VECTORS.S;
          break;
        case 'ArrowRight':
          vector = MOVE_VECTORS.E;
          break;
        case 'ArrowLeft':
          vector = MOVE_VECTORS.W;
          break;
      }

      await this.$root.$data.controllers.PlayerController.movePlayer(vector);

      await this.renderLevel();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style>
.dyn {
  border: 1px solid #ff0000;
}
</style>
