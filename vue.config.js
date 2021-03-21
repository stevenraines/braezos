const configureAPI = require('./server/configure.js');
const postConfigureAPI = require('./server/postconfigure.js');
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
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept',
    },
    before: configureAPI,
    after: postConfigureAPI,
  },
  transpileDependencies: ['vuetify'],
};
