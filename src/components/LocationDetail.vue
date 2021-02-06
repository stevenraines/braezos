<template>
  <v-container class="section-border">
    <v-row>
      <v-col cols="12">
        {{ currentLocation.cellIndex }}
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "LocationDetail",
  data: function() {
    return {};
  },
  computed: {
    currentLocation: function() {
      return this.$store.state.location;
    },
  },
};
</script>
