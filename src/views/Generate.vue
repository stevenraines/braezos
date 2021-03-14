<template>
  <v-layout>
    <v-flex d-flex flex xs12 fill-height>
      <!-- LEFT COLUMN -->
      <div style="width:20vw"></div>
      <!-- CENTER COLUMN -->
      <v-layout xs4 column wrap class="full-height-flex-column">
        <v-flex style="flex:1"></v-flex>
        <v-flex style="flex:1; style:padding:5px; text-align:center">
          <H1>Generating</H1>
          <h2>{{status}}</h2>
        </v-flex>
        <v-flex style="flex:2; style:padding:5px; text-align:center">
          <div></div>
        </v-flex>
        <v-flex style="flex:1"></v-flex>
      </v-layout>

      <!-- RIGHT COLUMN -->
      <div style="width:20vw"></div>
    </v-flex>
  </v-layout>
</template>

<script>
//import Environment from '../classes/environment.class';
//import params from '../../params.config';
import { EventBus } from '../eventbus.js';

export default {
  name: 'Generate',
  data: function () {
    return {
      status: null,
    };
  },
  components: {},
  computed: {},
  beforeCreate() {
    // set-up the environment
  },

  created() {
    EventBus.$on('generation_status', this.showGenerationStatus);

    // if (!window.GameEngine.World)
    //window.GameEngine.World = this.generateWorld();

    window.setTimeout(
      function () {
        this.setupEnvironmentComplete();
      }.bind(this),
      100
    );
  },
  beforeDestroy() {
    EventBus.$off('EnvironmentSetupComplete', this.continueGame);
    EventBus.$off('generation_status', this.showGenerationStatus);
  },
  methods: {
    showGenerationStatus(data) {
      this.status = data;
    },
    generateWorld() {
      /*
      let params = {
        seed: 5,
      };
*/
      //   let world = new World(params);
      //  console.log(world);
      //   return world;
    },
    setupEnvironmentComplete() {
      this.$router.push('WorldExplorer');
    },
  },
};
</script>

<style scoped>
</style>
