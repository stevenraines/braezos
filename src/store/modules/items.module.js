//import _ from 'lodash';

const ItemsStore = {
  namespaced: true,
  state: {
    items: [],
  },
  getters: {},
  mutations: {
    addItem(state, item) {
      state.items.push(item);
    },
  },
};

export default ItemsStore;
