<template>
  <div>
    <div>
      <object
        id="svg-object"
        type="image/svg+xml"
        data="./maps/map.svg"
        v-bind:width="width"
        v-bind:height="height"
      ></object>
    </div>
    <div>
      <button v-on:click="resetSVG()">%</button>

      <button v-on:click="zoomSVG(10)">+</button>
      <button v-on:click="zoomSVG(-10)">-</button>
      <button v-on:click="panSVGV(10)">Up</button>
      <button v-on:click="panSVGV(-10)">Down</button>
      <button v-on:click="panSVGH(10)">Left</button>
      <button v-on:click="panSVGH(-10)">Right</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Map",
  data: function() {
    return {
      height: 800,
      width: 800,
      mapSVG: null,
    };
  },
  components: {},
  created: function() {
    window.addEventListener("message", this.handlePostedMessage, false);
  },
  methods: {
    handlePostedMessage: function(message) {
      if (message.data.event == "register" && message.data.elementId == "map") {
        this.mapSVG = message.source;
        return;
      }

      if (message.data.event == "click" && message.source == this.mapSVG) {
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
