const configureAPI = require('./server/configure.js');

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      alias: {
        shared: '/shared',
      },
      modules: ['/shared'],
    },
    resolveLoader: {
      modules: ['/shared'],
    },
  },
  runtimeCompiler: true,
  devServer: {
    before: configureAPI,
  },
  transpileDependencies: ['vuetify'],
};
