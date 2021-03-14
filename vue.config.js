const configureAPI = require('./server/configure.js');

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
  },
  runtimeCompiler: true,
  devServer: {
    before: configureAPI,
  },
  transpileDependencies: ['vuetify'],
};
