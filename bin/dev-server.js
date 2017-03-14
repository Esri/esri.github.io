var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var Acetate = require('acetate');
var createAcetateServer = require('acetate/lib/modes/server');
var webpackConfig = require('../webpack.config.js');
var modRewrite = require('connect-modrewrite');

var compiler = webpack(webpackConfig);

var webpackDevserver = new WebpackDevServer(compiler, {
  stats: {
    colors: true,
    chunkModules: false,
    children: false
  }
});

webpackDevserver.listen(8080, 'localhost', function () {
  createAcetateServer(new Acetate({
    log: 'debug',
    args: {
      env: 'local',
      assetPath: webpackConfig.output.publicPath
    }
  }), {
    port: 8000,
    middleware: [
      modRewrite([
        '^/sign-up /root/ [L]',
        '^/dashboard /root/ [L]',
        '^/search /root/ [L]',
        '^/complete-sign-up /root/ [L]',
        '^/activate /root/ [L]'
      ])
    ]
  });
});
