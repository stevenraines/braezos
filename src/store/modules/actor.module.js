import _ from 'lodash';
import VuexReset from '@ianwalter/vuex-reset';

const ItemsStore = {
  plugins: [VuexReset()],
  namespaced: true,
  state: {
    singleton: false,
    collection: [],
  },
  getters: {},
  mutations: {
    reset: () => {},
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
