const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { AotPlugin } = require('@ngtools/webpack');
const { ForkCheckerPlugin } = require('awesome-typescript-loader');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');

const ENV = process.env.JOB_ENV || 'local';

const CommonConfig = {
  devtool: 'source-map',
  entry: {
    index: './src/assets/js-es6/index.js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ]
      },
      {
        test: /\.(html|css)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'raw-loader'
      },
      {
        test: /\.scss$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['raw-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['root']
    }),
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      path.join(process.cwd(), 'src')
    ),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    })
  ],
  output: {
    path: path.join(__dirname, 'build', 'assets', 'js'),
    sourceMapFilename: '[name].js.map',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  }
};

const AotConfig = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: [
          '@ngtools/webpack'
        ]
      }
    ]
  },
  plugins: [
    new AotPlugin({
      tsConfigPath: './tsconfig.json'
    })
  ]
};

const JitConfig = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules|bower_components)/,
        loaders: [
          'awesome-typescript-loader',
          'angular2-template-loader',
          'angular-router-loader'
        ]
      }
    ]
  },
  plugins: [
    new ForkCheckerPlugin()
  ]
};

if (ENV === 'local') {
  module.exports = merge(CommonConfig, JitConfig, {
    watchOptions: {
      aggregateTimeout: 1500,
      ignored: /node_modules/
    },
    output: {
      publicPath: 'http://localhost:8080/'
    }
  });
}

if (ENV === 'test') {
  module.exports = merge.strategy({
    entry: 'replace'
  })(CommonConfig, {
    devtool: 'inline-source-map',
    entry: {},
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /(node_modules|bower_components)/,
          loaders: [
            'awesome-typescript-loader',
            'angular2-template-loader',
            'angular-router-loader'
          ]
        }
      ]
    },
    output: {
      publicPath: 'http://localhost:8080/'
    }
  });
}

// preview sites use dev artifacts use production
if (ENV === 'production' || ENV === 'dev') {
  module.exports = merge(CommonConfig, AotConfig, {
    performance: {
      hints: true
    },
    plugins: [
      new ProgressBarPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        beautify: false,
        comments: false,
        compress: {
          screw_ie8: true,
          warnings: false
        },
        mangle: {
          screw_i8: true,
          keep_fnames: true
        }
      })
    ],
    output: {
      publicPath: '/assets/js/'
    }
  });
}
