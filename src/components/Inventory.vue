<template>
  <div>
    <v-list two-line>
      <v-list-item v-for="item in items" :key="item.id">
        <template v-slot:default="">
          <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>

            <v-list-item-subtitle
              class="text--primary"
              v-text="item.headline"
            ></v-list-item-subtitle>

            <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-list-item-action-text
              v-text="item.action"
            ></v-list-item-action-text>
            <v-icon
              v-show="!item.owner"
              @click="pickupItem(item)"
              color="yellow darken-3"
            >
              mdi-arrow-collapse-up
            </v-icon>
            <v-icon
              v-show="item.owner"
              @click="dropItem(item)"
              color="yellow darken-3"
            >
              mdi-arrow-collapse-down
            </v-icon>
          </v-list-item-action>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>
<script>
export default {
  name: 'Inventory',
  props: ['items'],
  data: function() {
    return {};
  },
  methods: {
    dropItem: function(item) {
      this.$emit('dropItem', item);
    },
    pickupItem: function(item) {
      this.$emit('pickupItem', item);
    },
  },
  computed: {},
};
</script>
<style scoped></style>
