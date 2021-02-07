<template>
  <v-container fluid>
    <v-row>
      <v-col cols="8">
        <Map />
      </v-col>
      <v-col cols="4">
        <LocationDetail />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import Map from "@/components/Map.vue";
import LocationDetail from "@/components/LocationDetail.vue";

export default {
  name: "Home",
  components: {
    Map,
    LocationDetail,
  },
};
</script>
