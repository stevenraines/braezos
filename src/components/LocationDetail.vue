<template>
  <v-container class="section-border">
    <v-row>
      <v-col cols="12">
        <h1>{{ event.title }}</h1>
        Type: {{ location.terrainType.name }} <br /><br />
        {{ event.text }}
        {{ location.encounter.items }}
        <div v-if="items">
          You see:
          <ul>
            <li v-for="item in items" :key="item.id">
              {{ item.item.name }}
              <v-btn v-on:click="takeItem(item.id)">Take</v-btn>
            </li>
          </ul>
        </div>
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
  methods: {
    takeItem: function(id) {
      this.$store.dispatch("pickUpItem", id);
    },
  },
  computed: {
    items() {
      return this.location.encounter.items;
    },
    event() {
      if (!_.get(this.location, "encounter.events")) return null;
      let event = this.location.encounter.events[this.location.encounter.state];
      return event;
    },
    ...mapState(["location"]),
  },
};
</script>
