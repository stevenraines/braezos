import _ from 'lodash';
import VuexReset from '@ianwalter/vuex-reset';

export default class Collection {
  constructor() {
    this.plugins = [VuexReset()];
    this.namespaced = true;
    this.state = {
      singleton: false,
      collection: [],
    };
    this.getters = {};
    this.actions = {};
    this.mutations = {
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
    };
  }
}
