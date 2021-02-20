<template>
  <v-container fluid fill-height>
    <v-row fill-height>
      <v-col widthclass="colX">
        <Level />
      </v-col>
      <v-col class="sideColumn">
        <Console class="console"></Console>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import Level from '@/components/Level.vue';

import Console from '@/components/Console.vue';
export default {
  name: 'Home',
  components: {
    Level,

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
