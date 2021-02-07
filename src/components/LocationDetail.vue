<template>
  <v-container class="section-border">
    <v-row>
      <v-col cols="12">
        <h1>Location {{ location.id }}</h1>
        Type: {{ location.terrainType }}

        {{ location }}
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "LocationDetail",
  data: function() {
    return {};
  },
  computed: {
    ...mapState(["location"]),
  },
};
</script>
