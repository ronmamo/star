var path = require('path');
var qs = require('querystring');
var webpack = require('webpack');
process.env.NODE_ENV = process.env.NODE_ENV || "development";
const basepath = path.join(__dirname, '../..')

module.exports = {
  devtool: '#eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './web-server/index.web.js'
  ],
  output: {
    path: basepath,
    filename: 'bundle.js',
    publicPath: '/dist'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js'],
    alias: {
      request: 'browser-request'
    }
  },
  module: {
    loaders: [
      // Javascript
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          "presets": ["es2015","react","stage-0"],
          "plugins": [
            "transform-runtime",
          ],
          "env": {
            "development": {
              "presets": ["react-hmre"],
              "plugins": [
                ["transform-decorators-legacy",
                  "react-transform", {
                  "transforms": [{
                    "transform": "react-transform-hmr",
                    "imports": ["react"],
                    "locals": ["module"]
                  }]
                }]
              ]
            }
          },
        }
      },

      // CSS
      {
        test: /\.css$/,
        include: path.join(basepath, 'app'),
        loader: 'style-loader!css-loader?' + qs.stringify({
          modules: true,
          importLoaders: 1,
          localIdentName: '[path][name]-[local]'
        })
      },
      {
        test: /\.css$/,
        exclude: path.join(basepath, 'app'),
        loader: 'style-loader!css-loader'
      }

    ]
  }
};
