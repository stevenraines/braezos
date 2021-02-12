<template>
  <v-container fluid fill-height>
    <v-row fill-height>
      <v-col class="colX">
        <Map />
      </v-col>
      <v-col class="sideColumn">
        <LocationDetail class="locationDetail"></LocationDetail>
        <Console class="console"></Console>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import Map from '@/components/Map.vue';
import LocationDetail from '@/components/LocationDetail.vue';
import Console from '@/components/Console.vue';
export default {
  name: 'Home',
  components: {
    Map,
    LocationDetail,
    Console,
  },
};
</script>

<style>
.sideColumn {
  display: flex;
  flex-direction: column;
}

.console {
  flex: 4;
}

.locationDetail {
  flex: 6;
  background-color: #000;
}
</style>
