<template>
  <v-container class="section-border">
    <v-row>
      <v-col cols="12">
        <h1>{{ currentEvent.title }}</h1>
        Type: {{ location.terrainType.name }} <br /><br />
        {{ currentEvent.text }}
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState } from "vuex";
import _ from "lodash";
//import EncounterStates from "../../shared/enums/encounterStates";
export default {
  name: "LocationDetail",
  data: function() {
    return {};
  },
  computed: {
    currentEvent() {
      if (!_.get(this.location, "encounter")) return null;
      let event = this.location.encounter.events[this.location.encounter.state];
      return event;
    },
    ...mapState(["location"]),
  },
};
</script>
