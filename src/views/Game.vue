<template>
  <v-layout v-if="player">

    <v-dialog
      v-model="dialog"
      width="50vw"
    >
    
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Privacy Policy
        </v-card-title>

        <v-card-text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            I accept
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-flex d-flex flex xs12 fill-height style="width: 99vw;">
      <!-- LEFT COLUMN -->
      <v-layout
        column
        wrap
        :key="currentScreen"
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
          {{ currentScreen }}
        </v-flex>
        <v-flex style="flex:11; padding:5px; overflow: auto;">
          <Level
            style="position:relative; top:0;left:0"
            v-if="currentScreen == 0"
          ></Level>
          <div style="padding:5px;">
            <Inventory
              v-show="currentScreen == 1"
              @pickupItem="pickupItem"
              @dropItem="dropItem"
              v-bind:items="player.inventory"
            ></Inventory>
          </div>
        </v-flex>
        <div style="" class="bar">
          <v-tabs  dark centered icons-and-text v-model="currentScreen" value="Cell">
            <v-tab id="Cell">
              Map
              <v-icon>mdi-map</v-icon>
            </v-tab>
            <v-tab id="Inventory">
              Inventory
              <v-icon>mdi-bag-personal-outline</v-icon>
            </v-tab>
            <v-tab id="Character">
              Abilities
              <v-icon>mdi-human</v-icon>
            </v-tab>
            <v-tab id="Equipment">
              Equipment
              <v-icon>mdi-sword</v-icon>
            </v-tab>
            <v-tab id="Magic">
              Spellbook
              <v-icon>mdi-auto-fix</v-icon>
            </v-tab>
             <v-tab id="Crafting">
               Crafting
              <v-icon>mdi-hammer-wrench</v-icon>
            </v-tab>
            <v-tab id="Journal">
              Journal
              <v-icon>mdi-book-open-variant</v-icon>
            </v-tab>
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
import Point from '../classes/helpers/point.class';
import Actor from '../classes/things/actor.class';
import Item from '../classes/things/item.class';
import Structure from '../classes/things/structure.class';

import { EventBus } from '../eventbus.js';

import _ from 'lodash';

// @ is an alias to /src
import Level from '@/components/Level.vue';
import Inventory from '@/components/Inventory.vue';
import Console from '@/components/Console.vue';

export default {
  name: 'Game',
  data: function() {
    return {
      currentScreen: 'Cell',
      dialog: false,
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
    EventBus.$on('SetScreen', this.setScreen);
    EventBus.$on('Interaction', this.manageInteraction);
  },
  mounted() {
    if (!window.GameEngine.Environment) {
      return this.$router.push('Generate');
    }

    this.setupGame();
  },
  beforeDestroy() {
    EventBus.$off('SetScreen', this.setScreen);
    EventBus.$off('Interaction', this.manageInteraction);
    window.GameEngine.EventManager.stop();
  },
  methods: {
    quitGame() {
      this.$router.push('/');
    },
    manageInteraction(data) {
      console.log(`${data.source.name} interacted with ${data.target[0].name}`);
    },
    setScreen(screenData) {
      if (parseInt(screenData.screen) >= -1) {
        this.currentScreen = screenData.screen;
      }

      // handle screen specific commands

      if (screenData.command) {
        if (_.find(screenData.validScreens, this.currentScreen)) {
          this.dialog = true;
        }
      }
    },
    setupGame() {
      window.GameEngine.Environment.register();
      window.GameEngine.Player.register();

      let enemyPosition = new Point(window.GameEngine.Player.position);
      enemyPosition.x += 3;

      new Actor.createOrLoad(
        {
          name: `enemy1`,
          position: new Point(window.GameEngine.Player.position).applyVector({
            x: 2,
            y: 2,
            d: 0,
          }),
        },
        Actor,
        'actor'
      ).register();

      new Structure.createOrLoad(
        {
          name: 'building1',
          position: new Point(window.GameEngine.Player.position).applyVector({
            x: -5,
            y: 0,
            d: 0,
          }),
        },
        Structure,
        'structure'
      ).register();

      new Item.createOrLoad(
        {
          name: 'item1',
          position: new Point(window.GameEngine.Player.position).applyVector({
            x: -2,
            y: -2,
            d: 0,
          }),
        },
        Item,
        'item'
      );
    },
    pickupItem(item) {
      this.player.pickup(item);
    },
    dropItem(item) {
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
