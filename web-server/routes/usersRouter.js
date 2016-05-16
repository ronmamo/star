import bodyParser from 'body-parser';
import chalk from 'chalk';
import response from './response';
import config from '../config';

export const API_PATH = '/api/users';
const collection = 'users';

// orchestrate
var oio = require('orchestrate');
var orchestrateToken = config.webserver.orchestrateToken;
var db = orchestrateToken ? oio(orchestrateToken) : null;

if (orchestrateToken) {
  console.log(chalk.bold.green('orchestrate db connected'), db);
} else {
  console.log(chalk.red('orchestrateToken was not configured.'))
}

export default router => {
  console.log(chalk.green(`Using route ${API_PATH}`));

  router.get(API_PATH, function (req, res) {
    const params = req.params;
    if (params && req.query) {
      const query = req.query.query || {limit: 10};
      console.log(chalk.green("query req"), collection, query);
      db.list(collection, query)
        .then(page1 => {
          if (page1) {
            const results = page1.body.results;
            response.ok(req, res, results);
            console.log(chalk.green('query results'), results.length);
          }
          // Got First Page
//        if (page1.links && page1.links.next) {
//          page1.links.next.get().then(function (page2) {
//            // Got Second Page
//          })
//        }
        })
        .fail(err => response.error(req, res, 500, {error: err}));
    }
  });

  router.get(`${API_PATH}/:id`, function (req, res) {
    const params = req.params;
    if (params && req.query && params.id) {
      const id = params.id;
      console.log(chalk.green("get req"), collection, id);
      db.get(collection, id)
        .then(result => {
          response.ok(req, res, result.body);
          console.log(chalk.green(`get results ${results.length}`));
        })
        .fail(err => response.error(req, res, 500, {error: err}));
    }
  });

  router.post(API_PATH, bodyParser.json(), function (req, res) {
    const headers = req.headers;
    const params = req.params;
    if (params) {
      const body = req.body;
      console.log(chalk.blue('post req'), params, body);
      if (body && Array.isArray(body.users)) {
        body.users.map(user => {
          db.put(collection, user.username, user)
            .then(result => {
              response.ok(req, res, {message: 'ok'});
            })
            .fail(err => response.error(req, res, 500, {error: err}));
        });
      }
    }
  });
}
