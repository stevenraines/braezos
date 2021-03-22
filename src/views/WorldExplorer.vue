<template>
  <v-layout>
    <v-flex columns flex xs8 fill-height>
      <div id="renderer" ref="renderer"></div>

      <v-flex d-flex flex fill-height>
        [{{position}}]
        <br />
        {{player}}
      </v-flex>
    </v-flex>
    <v-flex columns flex xs6 fill-height>
      <v-flex d-flex flex fill-height>
        <img id="worldMap" src="/api/world/map" />
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

          <v-text-field @change="renderPlayerMap()" v-model="position.x"></v-text-field>
          <v-text-field @change="renderPlayerMap()" v-model="position.y"></v-text-field>

          <v-btn @click="quit()">Quit</v-btn>
        </div>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
import PixiRenderer from '../classes/pixiRenderer.class';
import _ from 'lodash';
export default {
  name: 'WorldExplorer',
  data: function () {
    return {
      tileCache: null,
      positionData: {},
      PIXI: null,
      tileCacheRadius: 24,
    };
  },
  components: {},
  computed: {
    position() {
      return _.get(window.GameEngine.Player, 'position', { x: 0, y: 0 });
    },
    player() {
      return _.get(window.GameEngine, 'Player', {});
    },
  },

  async mounted() {
    if (!window.GameEngine.Player) return this.setupPlayer();
    this.PIXI = new PixiRenderer(this.$refs.renderer, {
      antialias: false,
      transparent: false,
      drawRadius: window.GameEngine.Player.viewRadius,
    });

    await this.updateTileCache();

    await this.renderPlayerMap();
  },
  sockets: {
    disconnect() {},
  },
  methods: {
    setupPlayer() {
      this.$router.replace('/');
    },
    async updateTileCache() {
      let response = await this.axios.post('/api/player/tiles', {
        name: window.GameEngine.Player.name,
        x: window.GameEngine.Player.position.x,
        y: window.GameEngine.Player.position.y,
        d: window.GameEngine.Player.position.d,
      });

      this.tileCache = response.data;
    },
    async movePosition(vector) {
      await window.GameEngine.Player.move(vector);
      this.updateTileCache();
      await this.renderPlayerMap();
    },

    async renderPlayerMap() {
      this.positionData = this.PIXI.renderWorld(
        window.GameEngine.Player,
        this.tileCache
      );
    },
    quit() {
      this.$store.dispatch('resetGame');
      window.GameEngine.Player = null;
      window.GameEngine.Environment = null;
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
