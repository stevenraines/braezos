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

      let visibleByPlayer = selectedCell.visibleFrom(
        this.$root.$data.controllers.PlayerController.player.position,
        this.$root.$data.controllers.PlayerController.player.viewDistance
      );
    },
    renderLevel: async function() {
      if (!this.$root.$data.controllers.EnvironmentController.level) return;
      let player = this.$root.$data.controllers.PlayerController.player;
      this.renderedMapImg = this.$root.$data.controllers.EnvironmentController.level.renderLevelAsImgSrc(
        player.position,
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
