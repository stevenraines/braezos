<template>
  <div>
    <Map />
    <LocationDetail />
  </div>
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
