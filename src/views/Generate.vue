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
import Environment from '../classes/environment.class';
import params from '../../params.config';
import { EventBus } from '../eventbus.js';

export default {
  name: 'Generate',
  data: function() {
    return {};
  },
  components: {},
  computed: {},
  beforeCreate() {
    // set-up the environment
  },
  created() {
    if (!window.GameEngine.Environment) {
      EventBus.$on('EnvironmentSetupComplete', this.setupEnvironmentComplete);
      window.GameEngine.Environment = new Environment(params);
    } else {
      this.setupEnvironmentComplete();
    }
  },
  beforeDestroy() {
    EventBus.$off('EnvironmentSetupComplete', this.continueGame);
  },
  methods: {
    setupEnvironmentComplete() {
      this.$router.push('CreateCharacter');
    },
  },
};
</script>

<style scoped></style>
