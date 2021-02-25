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

export default {
  name: 'Level',
  data: function() {
    return {
      levelIndex: 0,

      renderedMapImg: null,
    };
  },

  components: {},

  beforeCreate() {},
  created() {
    EventBus.$on('RenderLevel', this.renderLevel);
    EventBus.$on('click', this.handleGlobalEvent);
    EventBus.$on('setupComplete', this.setupComplete);
  },
  mounted() {
    this.renderLevel();
  },
  methods: {
    setupComplete: function() {
      this.renderLevel();
    },
    handleLevelClick(event) {
      let scaleX =
        window.GameEngine.Environment.level.renderArea.width /
        event.target.width;
      let scaleY =
        window.GameEngine.Environment.level.renderArea.height /
        event.target.height;

      let selectedMapCoordinate = {
        x: Math.floor(
          event.offsetX * scaleX +
            window.GameEngine.Environment.level.viewBox.startX
        ),
        y: Math.floor(
          event.offsetY * scaleY +
            window.GameEngine.Environment.level.viewBox.startY
        ),
      };

      let selectedCell = window.GameEngine.Environment.level.getCellByWorldPosition(
        selectedMapCoordinate
      );

      console.log('selected Cell', selectedCell);
    },
    renderLevel: async function() {
      if (!window.GameEngine.Environment.level) return;
      let player = window.GameEngine.Player;

      let mapDistance = (player.viewDistance + 1) * 2; // set this to be one bigger than the player's view size so there is always a border
      let mapSize = mapDistance * window.GameEngine.Environment.level.cellSize;

      this.renderedMapImg = window.GameEngine.Environment.level.renderLevelAsImgSrc(
        player,
        {
          width: mapSize,
          height: mapSize,
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
  background-color: #000000;
  height: 75vh;
}
</style>
