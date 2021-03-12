<template>
  <v-layout>
    <v-flex columns flex xs8 fill-height>
      <div id="renderer" ref="renderer"></div>

      <v-flex d-flex flex fill-height>{{positionData}}</v-flex>
    </v-flex>
    <v-flex columns flex xs6 fill-height>
      <v-flex d-flex flex fill-height>
        {{chunkSize}}
        <canvas
          v-bind:height="worldMapSize"
          v-bind:width="worldMapSize"
          ref="map"
          id="map"
        ></canvas>
      </v-flex>

      <v-flex d-flex flex fill-height>
        <div>
          <table>
            <tr>
              <td>
                <v-btn large outlined elevation="4" @click="movePosition({x:-1,y:-1})">&nwarr;</v-btn>
              </td>
              <td>
                <v-btn large outlined elevation="4" @click="movePosition({x:0,y:-1})">&uarr;</v-btn>
              </td>
              <td>
                <v-btn large outlined elevation="4" @click="movePosition({x:1,y:-1})">&nearr;</v-btn>
              </td>
            </tr>
            <tr>
              <td>
                <v-btn large outlined elevation="4" @click="movePosition({x:-1,y:0})">&larr;</v-btn>
              </td>
              <td></td>
              <td>
                <v-btn large outlined elevation="4" @click="movePosition({x:1,y:0})">&rarr;</v-btn>
              </td>
            </tr>
            <tr>
              <td>
                <v-btn large outlined elevation="4" @click="movePosition({x:-1,y:1})">&swarr;</v-btn>
              </td>
              <td>
                <v-btn large outlined elevation="4" @click="movePosition({x:0,y:1})">&darr;</v-btn>
              </td>
              <td>
                <v-btn large outlined elevation="4" @click="movePosition({x:1,y:1})">&searr;</v-btn>
              </td>
            </tr>
          </table>

          <v-text-field @change="renderWorld()" v-model="x"></v-text-field>
          <v-text-field @change="renderWorld()" v-model="y"></v-text-field>
          <v-btn @click="regenerateWorld()">Regenerate</v-btn>
          <v-btn @click="quit()">Quit</v-btn>
        </div>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
import PixiRenderer from '../classes/pixiRenderer.class';
export default {
  name: 'WorldExplorer',
  data: function () {
    return {
      positionData: {},
      PIXI: null,
      x: 0,
      y: 0,
      d: 0,

      exponent: 1,
    };
  },
  components: {},
  computed: {
    chunkSize() {
      if (!window.GameEngine.World) return 0;
      return window.GameEngine.World.chunkSize;
    },
    worldMapSize() {
      if (!window.GameEngine.World) return 0;
      return window.GameEngine.World.chunkSize * 5;
    },
  },
  created() {
    // if (!window.GameEngine.Environment) return this.$router.replace('Generate');
  },
  mounted() {
    if (!window.GameEngine.World) return this.$router.replace('Generate');
    window.GameEngine.World.renderToCanvas(this.x, this.y, this.$refs.map);

    this.PIXI = new PixiRenderer(this.$refs.renderer, {
      antialias: false,
      transparent: false,
      resolution: window.GameEngine.World.resolution,
    });

    this.renderWorld();
  },
  methods: {
    async movePosition(vector) {
      this.x = parseInt(this.x) + vector.x;
      this.y = parseInt(this.y) + vector.y;
      this.renderWorld();
    },
    regenerateWorld() {
      window.GameEngine.World = null;
      this.$router.replace('Generate');
    },
    renderWorld() {
      if (!window.GameEngine.World) return;

      /*
      if (
        this.x % (this.chunkSize / 2) == 0 ||
        this.y % (this.chunkSize / 2) == 0
      ) {
        window.GameEngine.World.renderToCanvas(this.x, this.y, this.$refs.map);
      }
*/
      this.positionData = this.PIXI.renderWorld(
        this.x,
        this.y,
        this.d,
        window.GameEngine.World
      );
    },
    quit() {
      return this.$router.replace('/');
    },
  },
};
</script>

<style scoped>
#map {
  height: 300px;
  width: 300px;
  border: 1px solid #000;
}
#renderer {
  height: 642px;
  width: 642px;
  border: 1px solid #000;
}
</style>
