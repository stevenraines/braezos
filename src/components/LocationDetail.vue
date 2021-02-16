<template>
  <v-card class="card">
    {{ player.position }}
    {{ playerWorldCell }}
    <hr />
  </v-card>
</template>
<script>
import { mapState } from 'vuex';
import _ from 'lodash';
//import EncounterStates from "../../shared/enums/encounterStates";
export default {
  name: 'LocationDetail',
  data: function() {
    return {};
  },
  methods: {
    takeItem: function(id) {
      this.$store.dispatch('pickUpItem', id);
    },
  },
  computed: {
    playerWorldCell() {
      return this.$root.$data.controllers.PlaceController.getWorldCellPosition(
        this.player.position
      );
    },
    items() {
      return this.location.encounter.items;
    },
    event() {
      if (!_.get(this.location, 'encounter.events')) return null;
      let event = this.location.encounter.events[this.location.encounter.state];
      return event;
    },
    ...mapState({
      player: state => state.player,
      places: state => state.places,
    }),
  },
};
</script>
