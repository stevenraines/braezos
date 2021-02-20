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
        this.$root.$data.controllers.EnvironmentController.level.renderArea
          .width / event.target.width;
      let scaleY =
        this.$root.$data.controllers.EnvironmentController.level.renderArea
          .height / event.target.height;

      let selectedMapCoordinate = {
        x: Math.floor(
          event.offsetX * scaleX +
            this.$root.$data.controllers.EnvironmentController.level.viewBox
              .startX
        ),
        y: Math.floor(
          event.offsetY * scaleY +
            this.$root.$data.controllers.EnvironmentController.level.viewBox
              .startY
        ),
      };

      let selectedCell = this.$root.$data.controllers.EnvironmentController.level.getCellByWorldPosition(
        selectedMapCoordinate
      );

      console.log('selected Cell', selectedCell);
    },
    renderLevel: async function() {
      if (!this.$root.$data.controllers.EnvironmentController.level) return;
      let player = this.$root.$data.controllers.PlayerController.player;

      let mapDistance = (player.viewDistance + 1) * 2; // set this to be one bigger than the player's view size so there is always a border
      let mapSize =
        mapDistance *
        this.$root.$data.controllers.EnvironmentController.level.cellSize;

      this.renderedMapImg = this.$root.$data.controllers.EnvironmentController.level.renderLevelAsImgSrc(
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
  max-height: 75vh;
  max-width: 75vw;
}
</style>
