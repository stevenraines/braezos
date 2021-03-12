const configureAPI = require('./server/configure');

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
