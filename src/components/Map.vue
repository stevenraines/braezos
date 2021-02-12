<template>
  <v-container class="section-border">
    <v-row>
      <v-col cols="12">
        <div id="svg-object" key="renderedMap">
          <component :is="dynamicComponent" />
        </div>
      </v-col>
    </v-row>
  </v-container>
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
    EventBus.$on('click', this.handleGlobalEvent);
    EventBus.$on('setupComplete', this.renderMap);
    await this.renderMap();
  },
  async beforeUpdate() {},
  methods: {
    renderMap: async function() {
      if (!this.$store.state.player.location) return;

      renderer.init(this.$store.state.places, this.height, this.width);
      this.renderedMap = await renderer.renderMap(
        this.$store.state.player.location
      );
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
