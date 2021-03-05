import Collection from './collection.module';
const collection = new Collection();

export default {
  plugins: collection.plugins,
  namespaced: true,
  state: {
    ...collection.state,
  },
  getters: {
    ...collection.getters,
  },
  mutations: {
    ...collection.mutations,
  },
  actions: {
    ...collection.actions,
  },
};
