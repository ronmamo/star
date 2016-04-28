import bodyParser from 'body-parser';
import chalk from 'chalk';

export const API_PATH = '/api/users';
const collection = 'users';

const success = (res, json) => {
  res.status = 200;
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(json));
}

export const init = (app, db) => {
  const router = app;
  console.log(chalk.green(`using route ${API_PATH}`));

  router.get(API_PATH, function(req, res) {
    const params = req.params;
    if (params && req.query) {
      const query = req.query.query || { limit: 10 };
      console.log(chalk.green("query req"), collection, query);
      db.list(collection, query)
      .then(page1 => {
        if (page1) {
          const results = page1.body.results;
          success(res, results);
          console.log(chalk.green('query results'), results.length);
        }
        // Got First Page
//        if (page1.links && page1.links.next) {
//          page1.links.next.get().then(function (page2) {
//            // Got Second Page
//          })
//        }
      })
      .fail(err => {
        console.log("err", err);
      });
    }
  });

  router.get(`${API_PATH}/:id`, function(req, res) {
    const params = req.params;
    if (params && req.query && params.id) {
      const id = params.id;
      console.log(chalk.green("get req"), collection, id);
      db.get(collection, id)
      .then(result => {
        success(res, result.body);
        console.log(chalk.green(`get results ${results.length}`));
      })
      .fail(err => {
        console.log("err");
      });
    }
  });

  router.post(API_PATH, bodyParser.json(), function(req, res) {
    const headers = req.headers;
    const params = req.params;
    if (params) {
      const body = req.body;
      console.log(chalk.blue('post req'), body);
      if (body && Array.isArray(body.users)) {
        body.users.map(user => {
          db.put(collection, user.username, user)
          .then(result => {
            success(res, {message: 'ok'});
          })
          .fail(error => {
            console.log("error", error);
            res.status = 500;
            res.send(JSON.stringify('error'));;
          });
        });
      }
    }
  });
}
