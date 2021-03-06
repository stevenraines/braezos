<template>
    <v-card>
        Hi
          <div>Inventory Dialog</div>
          <ul :key="items.length">
            <li v-for="item in items" :key="item.id">
              <button @click="dropItem(item)">{{ item.name}}</button>
              </li>
            </ul>
      </v-card>

</template>
<script>
export default {
  name: 'InventoryDialog',
  props: ['items'],
  data: function() {
    return {};
  },
  methods: {
    dropItem: function(item) {
      console.log('drop', item);
      this.$emit('action', { type: 'dropItem', data: item });
    },
    pickupItem: function(item) {
      this.$emit('action', { type: 'pickupItem', data: item });
    },
  },
  computed: {},
};
</script>
<style scoped>
</style>
