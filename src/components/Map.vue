<template>
  <v-container class="section-border">
    <v-row>
      <v-col cols="12">
        <object
          id="svg-object"
          type="image/svg+xml"
          data="./maps/map.svg"
          v-bind:width="width"
          v-bind:height="height"
        ></object>
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
export default {
  name: "Map",
  data: function() {
    return {
      height: 600,
      width: 600,
      mapSVG: null,
    };
  },
  components: {},
  created: function() {
    window.addEventListener("message", this.handlePostedMessage, false);
  },
  computed: {
    currentLocation: function() {
      return this.$store.getters.currentLocation;
    },
  },
  methods: {
    handlePostedMessage: function(message) {
      if (message.data.event == "register" && message.data.elementId == "map") {
        this.mapSVG = message.source;
        return;
      }

      if (message.data.event == "click" && message.source == this.mapSVG) {
        // load details about the territory

        this.$store.commit("setCurrentLocation", {
          cellIndex: message.data.cellIndex,
        });

        this.mapSVG.postMessage(
          { event: "changeCellColor", elementId: message.data.elementId },
          "*"
        );
      }
    },

    resetSVG: function() {
      this.mapSVG.postMessage(
        {
          event: "resetSVG",
          elementId: "map",
          height: this.height,
          width: this.width,
        },
        "*"
      );
    },
    panSVGV: function(amount) {
      this.mapSVG.postMessage(
        {
          event: "panSVGV",
          elementId: "map",
          amount: amount,
          height: this.height,
          width: this.width,
        },
        "*"
      );
    },
    panSVGH: function(amount) {
      this.mapSVG.postMessage(
        {
          event: "panSVGH",
          elementId: "map",
          amount: amount,
          height: this.height,
          width: this.width,
        },
        "*"
      );
    },
    zoomSVG: function(amount) {
      this.mapSVG.postMessage(
        {
          event: "zoomSVG",
          elementId: "map",
          amount: amount,
          height: this.height,
          width: this.width,
        },
        "*"
      );
    },
  },
};
/*
function clickCell(elementId, source) {
  console.log(source);
  source
}
*/
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
