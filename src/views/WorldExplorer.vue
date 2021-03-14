<template>
  <v-layout>
    <v-flex columns flex xs8 fill-height>
      <div id="renderer" ref="renderer"></div>

      <v-flex d-flex flex fill-height>{{positionData}}</v-flex>
    </v-flex>
    <v-flex columns flex xs6 fill-height>
      <v-flex d-flex flex fill-height>
        {{chunkSize}}
        <img id="worldMap" src="/api/worldMap" />
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

          <v-text-field @change="renderPlayerMap()" v-model="x"></v-text-field>
          <v-text-field @change="renderPlayerMap()" v-model="y"></v-text-field>
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
      x: null,
      y: null,
      d: null,
      drawRadius: 10,
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
      return (
        window.GameEngine.World.chunkSize *
        window.GameEngine.World.islandRadiusInChunks *
        2 *
        3
      );
    },
  },

  async mounted() {
    this.PIXI = new PixiRenderer(this.$refs.renderer, {
      antialias: false,
      transparent: false,
      drawRadius: this.drawRadius,
    });

    if (this.x == null) {
      let response = await this.axios.get('/api/player/start');
      this.x = response.data.x;
      this.y = response.data.y;
      this.d = response.data.d;
    }

    await this.renderPlayerMap();
  },
  methods: {
    async movePosition(vector) {
      this.x = parseInt(this.x) + vector.x;
      this.y = parseInt(this.y) + vector.y;
      await this.renderPlayerMap();
    },

    async renderPlayerMap() {
      let response = await this.axios.get('/api/worldPositions', {
        params: { x: this.x, y: this.y, d: this.d, radius: this.drawRadius },
      });

      this.positionData = this.PIXI.renderWorld(
        this.x,
        this.y,
        this.d,
        response.data
      );
    },
    quit() {
      return this.$router.replace('/');
    },
  },
};
</script>

<style scoped>
#worldMap {
  height: 300px;
  width: 300px;
  border: 1px solid #000;
}
#renderer {
  border: 1px solid #000;
}
</style>
