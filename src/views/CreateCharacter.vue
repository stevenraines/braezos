<template>
  <v-layout>
    <v-flex d-flex flex xs12 fill-height>
      <!-- LEFT COLUMN -->
      <div style="width:20vw"></div>
      <!-- CENTER COLUMN -->
      <v-layout xs4 column wrap class="full-height-flex-column">
        <v-flex style="flex:1"></v-flex>
        <v-flex style="flex:1; style:padding:5px; text-align:center">
          <H1>Create Character</H1>

          <div>
            <v-btn v-on:click="startGame()">Start</v-btn>
          </div>
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
export default {
  name: 'CreateCharacter',
  data: function () {
    return {};
  },
  components: {},
  computed: {},
  created() {
    console.log('player', window.GameEngine.Player);
    if (window.GameEngine.Player && !window.GameEngine.Player.isNew)
      return this.startGame();
    if (!window.GameEngine.Player || !window.GameEngine.Player.name)
      return this.$router.push('/');
  },
  methods: {
    startGame: function () {
      window.GameEngine.Player.isNew = false;
      this.$store.commit('player/setPlayer', {
        name: window.GameEngine.Player.name,
      });

      this.$router.push('WorldExplorer');
    },
  },
};
</script>

<style scoped></style>
