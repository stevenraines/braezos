<template>
  <v-container fluid fill-height>
    {{ currentTab }}
    <v-tabs v-model="currentTab" value="Cell">
      <v-tab id="Cell">World</v-tab>
      <v-tab id="Inventory">Inventory</v-tab>
      <v-tab id="Character">Character</v-tab>
    </v-tabs>
    <v-row fill-height>
      <v-col>
        {{ player.currentCell.terrainType.name }}
        <hr />
        <Inventory
          v-show="currentTab == 0"
          @pickupItem="pickupItem"
          @dropItem="dropItem"
          v-bind:items="player.currentCell.inventory"
        ></Inventory>
        <Inventory
          v-show="currentTab == 1"
          @pickupItem="pickupItem"
          @dropItem="dropItem"
          v-bind:items="player.inventory"
        ></Inventory>
        <div :key="player.updateTime" v-show="currentTab == 2">
          {{ player }}
        </div>
      </v-col>
      <v-col class="sideColumn">
        <Level />
        <Console class="console"></Console>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import Level from '@/components/Level.vue';
import Inventory from '@/components/Inventory.vue';
import Console from '@/components/Console.vue';

export default {
  name: 'Home',
  data: function() {
    return {
      currentTab: 'Cell',
    };
  },
  components: {
    Level,
    Console,
    Inventory,
  },
  computed: {
    player: function() {
      return window.GameEngine.Player;
    },
  },
  methods: {
    pickupItem(item) {
      this.player.pickup(item);
    },
    dropItem(item) {
      console.log('drop');
      this.player.drop(item);
    },
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
