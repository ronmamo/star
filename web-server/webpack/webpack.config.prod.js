var path = require('path');
var qs = require('querystring');
var webpack = require('webpack');
const basepath = path.join(__dirname, '../..')

module.exports = {
  entry: [
    './index.web.js'
  ],
  output: {
    path: basepath + '/dist',
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
				"process.env": {
					NODE_ENV: JSON.stringify("production")
				}
		})
  ],
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          "presets": ["es2015","react"],
          "plugins": [
            "transform-runtime",
          ]
        }
      },
      {
        test: /\.css$/,
        include: /app/,
        loader: 'style-loader!css-loader?' + qs.stringify({
          modules: true,
          importLoaders: 1,
          localIdentName: '[path][name]-[local]'
        })
      },
      {
        test: /\.css$/,
        exclude: /app/,
        loader: 'style!css'
      },

    ]
  }
};
