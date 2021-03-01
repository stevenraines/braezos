<template>
  <v-layout v-if="player">
    <v-flex d-flex flex xs12 fill-height style="width: 99vw;">
      <!-- LEFT COLUMN -->
      <v-layout
        column
        wrap
        style="width: 50px;text-align: center"
        class="full-height-flex-column flex-grow-0 flex-shrink-0 bar"
      >
        <v-flex style="padding:5px;flex:1">
          <v-icon @click="quitGame()">mdi-exit-to-app</v-icon>
        </v-flex>
        <v-flex style="padding:5px;flex:11; text-align: center"></v-flex>
      </v-layout>

      <!-- CENTER COLUMN -->
      <v-layout column wrap class="full-height-flex-column">
        <v-flex style="padding:5px;flex:1;solid #000">
          {{ currentTab }}
        </v-flex>
        <v-flex style="flex:11; padding:5px; overflow: auto;">
          <Level
            style="position:relative; top:0;left:0"
            v-if="currentTab == 0"
          ></Level>
          <div style="padding:5px;">
            <Inventory
              v-show="currentTab == 1"
              @pickupItem="pickupItem"
              @dropItem="dropItem"
              v-bind:items="player.inventory"
            ></Inventory>
          </div>
        </v-flex>
        <div style="" class="bar">
          <v-tabs v-model="currentTab" value="Cell">
            <v-icon name="level" @click="issueCommand('m')">mdi-map</v-icon>
            <v-icon name="character" @click="issueCommand('c')"
              >mdi-human</v-icon
            >
            <v-icon name="inventory" @click="issueCommand('i')"
              >mdi-bag-personal-outline</v-icon
            >
            <v-icon name="equipment" @click="issueCommand('e')"
              >mdi-sword</v-icon
            >
            <v-icon name="magic" @click="issueCommand('s')"
              >mdi-auto-fix</v-icon
            >
            <v-icon name="crafting" @click="issueCommand('s')"
              >mdi-hammer-wrench</v-icon
            >
            <v-icon name="journal" @click="issueCommand('j')"
              >mdi-book-open-variant</v-icon
            >

            <v-tab id="Cell">World</v-tab>
            <v-tab id="Inventory">Inventory</v-tab>
            <v-tab id="Character">Character</v-tab>
          </v-tabs>
        </div>
      </v-layout>

      <!-- RIGHT COLUMN -->
      <v-layout
        style="min-width:300px; max-width: 500px"
        column
        wrap
        class="flex-grow-0 flex-shrink-0 full-height-flex-column"
      >
        <v-flex
          style="padding:5px;flex:1; overflow: auto;border-bottom:1px solid #000"
        >
        </v-flex>

        <Console
          style="padding:5px;flex:11; overflow: auto"
          class="console"
        ></Console>
      </v-layout>
    </v-flex>
  </v-layout>
</template>
<script>
// @ is an alias to /src
import Level from '@/components/Level.vue';
import Inventory from '@/components/Inventory.vue';
import Console from '@/components/Console.vue';

export default {
  name: 'Game',
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
  created() {
    if (!window.GameEngine.Environment) {
      this.$router.push('Generate');
    }
  },
  methods: {
    quitGame() {
      this.$router.push('/');
    },
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
