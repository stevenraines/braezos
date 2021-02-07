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
import TerrainTypes from "../../shared/enums/terrainTypes";
import _ from "lodash";
import { mapGetters } from "vuex";

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
  computed: {
    ...mapGetters(["normalState"]),
  },
  mounted: function() {},
  created: function() {
    window.addEventListener("message", this.handlePostedMessage, false);
  },

  methods: {
    setLocationColor: function(location, color) {
      let cellColor = color || "#cccccc";

      if (!color && _.get(location, "terrainType")) {
        cellColor = _.find(TerrainTypes, {
          name: location.terrainType.name,
        }).color;
      }

      this.mapSVG.postMessage(
        {
          event: "changeCellColor",
          elementId: location.elementId,
          color: cellColor,
          id: location.id,
        },
        "*"
      );
    },
    handlePostedMessage: async function(message) {
      if (message.data.event == "register" && message.data.elementId == "map") {
        this.mapSVG = message.source;
        // let location = _.get(this.$store.state, "location");
        let location = this.normalState.location;
        if (location) {
          this.setLocationColor(location, "orange");
        }
        return;
      }

      if (message.data.event == "click" && message.source == this.mapSVG) {
        await this.movePlayer(message);
      }
    },

    movePlayer: async function(message) {
      // store where we are:
      let priorLocation = this.normalState.location;

      // try and perform the move

      if (
        !(await this.$store.dispatch("movePlayer", {
          toCell: message.data.id,
        }))
      ) {
        return;
      }

      //if successful update the map appearance

      // if there is a prior location, change it back to it's previous color
      if (_.get(priorLocation, "terrainType")) {
        this.setLocationColor(priorLocation);
      }

      this.setLocationColor(this.normalState.location, "orange");
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
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
