<template>
  <v-flex d-flex child-flex>
    <v-card class="card">
      <div key="renderedMap">
        <component :is="dynamicComponent" />
      </div>
    </v-card>
  </v-flex>
</template>

<script>
import { EventBus } from '../eventbus.js';
import renderer from '../renderers/d3';
import MOVE_VECTORS from '../enums/moveVectors';

export default {
  name: 'Map',
  data: function() {
    return {
      placeData: {},
      playerData: {},
      map: null,
      renderedMap: null,
      height: 600,
      width: 600,
      mapSVG: null,
    };
  },

  components: {},
  mounted() {},
  computed: {
    dynamicComponent: function() {
      return {
        template: `<div>${this.renderedMap}</div>`,
        methods: {},
      };
    },
  },
  async created() {
    EventBus.$on('keyevent', this.handleKeyEvent);
    EventBus.$on('click', this.handleGlobalEvent);
    EventBus.$on('setupComplete', this.renderMap);
    await this.renderMap();
  },
  async beforeUpdate() {},
  methods: {
    renderMap: async function() {
      if (!this.$root.$data.controllers.PlayerController.player.location)
        return;

      renderer.init(
        this.$root.$data.controllers.PlaceController.visibleTerrain,
        this.$root.$data.controllers.EnvironmentController.params,
        this.height,
        this.width
      );

      this.renderedMap = await renderer.renderMap(
        this.$root.$data.controllers.PlayerController.player
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
      await this.renderMap();
    },
    handleGlobalEvent: async function(message) {
      if (message.event == 'click' && message.source == 'map') {
        await this.$root.$data.controllers.PlayerController.movePlayerToTerritory(
          message.id
        );
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style>
svg text.character {
  font-weight: normal;
}
</style>
