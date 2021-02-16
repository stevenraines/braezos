//import _ from 'lodash';

const ItemsStore = {
  namespaced: true,
  state: {
    items: [],
  },
  getters: {},
  mutations: {
    addItem(state, item) {
      state.items[item.id] = item;
    },
  },
};

export default ItemsStore;
