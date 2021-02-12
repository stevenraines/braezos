const configureAPI = require('./server/configure');

module.exports = {
  runtimeCompiler: true,
  devServer: {
    before: configureAPI,
  },
  transpileDependencies: ['vuetify'],
};
