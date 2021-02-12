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
import { mapState } from 'vuex';
import { EventBus } from '../eventbus.js';
import renderer from '../../shared/renderers/d3';

export default {
  name: 'Map',
  data: function() {
    return {
      map: null,
      moveUnit: 10,
      renderedMap: null,
      height: 600,
      width: 600,
      mapSVG: null,
    };
  },
  components: {},
  computed: {
    ...mapState({
      player: state => state.player,
      places: state => state.places,
    }),
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
      if (!this.$store.state.player.location) return;

      renderer.init(this.$store.state.places, this.height, this.width);
      this.renderedMap = await renderer.renderMap(this.$store.state.player);
    },
    handleKeyEvent: async function(message) {
      switch (message.code) {
        case 'ArrowUp':
          await this.$store.dispatch('player/movePlayerSmall', [
            0,
            -this.moveUnit,
          ]);
          await this.renderMap();
          break;
        case 'ArrowDown':
          await this.$store.dispatch('player/movePlayerSmall', [
            0,
            this.moveUnit,
          ]);
          await this.renderMap();
          break;
        case 'ArrowLeft':
          await this.$store.dispatch('player/movePlayerSmall', [
            -this.moveUnit,
            0,
          ]);
          await this.renderMap();
          break;
        case 'ArrowRight':
          await this.$store.dispatch('player/movePlayerSmall', [
            this.moveUnit,
            0,
          ]);
          await this.renderMap();
          break;
      }
    },
    handleGlobalEvent: async function(message) {
      if (message.event == 'click' && message.source == 'map') {
        await this.$store.dispatch(
          'player/movePlayer',
          this.places.cells[message.id]
        );
        await this.renderMap();
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
