require('babel-core/register')({
  ignore: /node_modules/,
  presets: ['es2015', 'stage-0', 'react'],
  plugins: ['transform-decorators-legacy', 'transform-runtime']
});

require('css-modules-require-hook')({
  generateScopedName: '[path][name]-[local]'
});

var express = require('express');
var chokidar = require('chokidar');
var webpack = require('webpack');
var webpackconfig = require('./webpack/webpack.config');
var compiler = webpack(webpackconfig);
var chalk = require('chalk');

var config = require('./config').default;
console.log(chalk.green("config"), config);

// app
var app = express();
var router = express.Router();
app.use(router);

// define sequelize models
var models = require('./models').default;

// add routes
const routes = require('./routes').default;
routes(router, models);

// Serve hot-reloading bundle to client
app.use(require("webpack-dev-middleware")(compiler, {
  noInfo: true, publicPath: webpackconfig.output.publicPath,
  stats: 'errors-only'
}));
app.use(require("webpack-hot-middleware")(compiler));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// Do "hot-reloading" of express stuff on the server
// Throw away cached modules and re-require next time
// Ensure there's no important state in there!
var watcher = chokidar.watch('./server');

watcher.on('ready', function () {
  watcher.on('all', function () {
    console.log("Clearing /server/ module cache from server");
    Object.keys(require.cache).forEach(function (id) {
      if (/[\/\\]server[\/\\]/.test(id)) delete require.cache[id];
    });
  });
});

// Do "hot-reloading" of react stuff on the server
// Throw away the cached client modules and let them be re-required next time
compiler.plugin('done', function () {
  console.log("Clearing /app/ module cache from server");
  Object.keys(require.cache).forEach(function (id) {
    if (/[\/\\]app[\/\\]/.test(id)) delete require.cache[id];
  });
});

// server
var http = require('http');
var server = http.createServer(app);

server.listen(3000, 'localhost', function (err) {
  if (err) throw err;

  var addr = server.address();

  console.log(chalk.bold.green('Listening at http://%s:%d'), addr.address, addr.port);
});
