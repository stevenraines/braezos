<template>
  <v-flex d-flex child-flex>
    <img
      class="level"
      v-on:click="handleLevelClick"
      :src="this.renderedMapImg"
    />
  </v-flex>
</template>

<script>
import { EventBus } from '../eventbus.js';
import Point from '../classes/point.class';

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
    EventBus.$on('RenderLevel', this.renderLevel);
    EventBus.$on('click', this.handleGlobalEvent);
    EventBus.$on('setupComplete', this.setupComplete);
    this.renderLevel();
  },
  methods: {
    setupComplete: function() {},
    handleLevelClick(event) {
      let scaleX = this.level.renderArea.width / event.target.width;
      let scaleY = this.level.renderArea.height / event.target.height;

      let selectedMapCoordinate = {
        x: Math.floor(event.offsetX * scaleX + this.level.viewBox.startX),
        y: Math.floor(event.offsetY * scaleY + this.level.viewBox.startY),
      };

      let selectedCell = this.level.getCellByWorldPosition(
        selectedMapCoordinate
      );
      console.log('clicked on cell', selectedCell);
    },
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style>
.level {
  padding: 0px;
  max-height: 75vh;
  max-width: 50vw;
}
</style>
