<template>
  <v-container class="section-border">
    <v-row>
      <v-col cols="12">
        <div id="svg-object" key="renderedMap">
          <component :is="dynamicComponent" />
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <table>
          <tr>
            <td><v-btn x-small v-on:click="zoomSVG(10)">+</v-btn></td>
            <td><v-btn x-small v-on:click="panSVGV(10)">Up</v-btn></td>
            <td><v-btn x-small v-on:click="zoomSVG(-10)">-</v-btn></td>
          </tr>
          <tr>
            <td><v-btn x-small v-on:click="panSVGH(10)">Left</v-btn></td>
            <td><v-btn x-small v-on:click="resetSVG()">%</v-btn></td>
            <td><v-btn x-small v-on:click="panSVGH(-10)">Right</v-btn></td>
          </tr>
          <tr>
            <td></td>
            <td><v-btn x-small v-on:click="panSVGV(-10)">Down</v-btn></td>
            <td></td>
          </tr>
        </table>
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
        methods: {
          someAction() {
            console.log('Action!');
          },
        },
      };
    },
  },
  async created() {
    EventBus.$on('click', this.handleGlobalEvent);

    await this.renderMap();
  },
  async beforeUpdate() {},
  methods: {
    renderMap: async function() {
      console.log('rendermap', this.$store.state);
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
    resetSVG: function() {
      this.mapSVG.postMessage(
        {
          event: 'resetSVG',
          elementId: 'map',
          height: this.height,
          width: this.width,
        },
        '*'
      );
    },
    panSVGV: function(amount) {
      this.mapSVG.postMessage(
        {
          event: 'panSVGV',
          elementId: 'map',
          amount: amount,
          height: this.height,
          width: this.width,
        },
        '*'
      );
    },
    panSVGH: function(amount) {
      this.mapSVG.postMessage(
        {
          event: 'panSVGH',
          elementId: 'map',
          amount: amount,
          height: this.height,
          width: this.width,
        },
        '*'
      );
    },
    zoomSVG: function(amount) {
      this.mapSVG.postMessage(
        {
          event: 'zoomSVG',
          elementId: 'map',
          amount: amount,
          height: this.height,
          width: this.width,
        },
        '*'
      );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
