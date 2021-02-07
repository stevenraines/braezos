<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center"></div>
      <v-spacer></v-spacer>
      <v-btn v-on:click="newGame()">New Game</v-btn>
      <v-btn v-on:click="newMap()">New Map</v-btn>
    </v-app-bar>
    <v-main>
      <Home :key="homekey" />
    </v-main>
  </v-app>
</template>

<script>
import Home from "./views/Home";

export default {
  name: "App",
  components: {
    Home,
  },

  data: () => ({
    homekey: 0,
  }),
  methods: {
    newGame: async function() {
      this.$store.commit("resetStore", {
        location: (await this.$http.get("/api/location/start")).data,
      });
      this.homekey += 1;
    },
    newMap: async function() {
      await this.$http.get("/api/makeMap");
    },
  },
  beforeCreate() {
    this.$store.commit("initialiseStore");
  },
};
</script>
<style>
.section-border {
  border: 1px solid #000000;
  overflow: auto;
}
</style>
