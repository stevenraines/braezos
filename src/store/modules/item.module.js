import _ from 'lodash';

const ItemsStore = {
  namespaced: true,
  state: {
    singleton: false,
    collection: [],
  },
  getters: {},
  mutations: {
    add(state, entity) {
      state.collection.push(entity);
    },
    update(state, entity) {
      let entityIndex = _.findIndex(state.collection, { id: entity.id });
      state.collection[entityIndex] = entity;
    },
    remove(state, entity) {
      state.collection = _.remove(state.collection, function(o) {
        o.id = entity.id;
      });
    },
  },
};

export default ItemsStore;
