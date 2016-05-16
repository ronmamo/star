import Sequelize from 'sequelize';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import * as response from './response';
import config from '../config';

// sequelize
const conf = config.webserver.sequelize;

export const sequelize = new Sequelize(conf.database, conf.username, conf.password, conf.options);
if (!sequelize) {
  console.log(chalk.red.bold('Could not connect sequelize'), err);
}

const connect = (models, force = true) => {
  Object.keys(models).map(model => {
    return models[model](sequelize);
  });

  sequelize.authenticate()
    .then(() => {
      console.log(chalk.bold.green('Sequelize connected'), sequelize.config);
    }, (err) => {
      console.log(chalk.red.bold('Unable to connect to the database:'), err);
    });

  sequelize.sync({force: force})
    .then(() => {
      console.log(chalk.green(`Sequelize models ${Object.keys(sequelize.models)}`));
    }, (err) => {
      console.log(chalk.red.bold('Could not connect sequelize'), err);
    });
}

export default (router, models) => {
  connect(models);

  Object.keys(sequelize.models).map(name => {
    const model = sequelize.models[name];
    const API_PATH = '/api/' + name;
    console.log(chalk.green('adding route'), API_PATH, model);

    // find
    // GET /${API_PATH}?query=
    router.get(API_PATH, (req, res) => {
      const params = req.params;
      const query = req.query && req.query.query || {limit: 10};
      if (params && query) {
        const p = JSON.parse(query);
        console.log('find', params, query, p);
        model.findAll(p)
          .then(result => response.ok(req, res, {result}))
          .catch(err => response.error(req, res, 500, {error: err}));
      }
    });

    // GET /${API_PATH}/:id
    router.get(`${API_PATH}/:id`, function (req, res) {
      const id = req.params.id;
      if (id) {
        model.find(id)
          .then(result => response.ok(req, res, result.get()))
          .catch(err => response.error(req, res, 500, {error: err}));
      }
    });

    // POST /${API_PATH} ${entity}
    router.post(API_PATH, bodyParser.json(), (req, res) => {
      const headers = req.headers;
      const params = req.params;
      const body = req.body;
      if (body) {
        const entity = body; // todo converter?
        if (!entity.id) {
          model.create(entity)
            .then(data => response.ok(req, res, {created: data}))
            .catch(err => response.error(req, res, 500, err));
        } else {
          model.update(entity, {where: {id: entity.id}})
            .then(data => response.ok(req, res, {message: 'ok', data}))
            .catch(err => response.error(req, res, 500, err));
        }
      }
    });

    // DELETE /${API_PATH}/:id
    router.delete(`${API_PATH}/:id`, (req, res) => {
      const headers = req.headers;
      const id = req.params.id;
      if (id) {
        model.findById(id)
          .then(result => {
            if (result) {
              result.destroy()
                .then(data => response.ok(req, res, {message: 'ok', data}))
                .catch(err => response.error(req, res, 500, err));
            } else {
              notFound(req, res);
            }
          })
          .catch(err => response.error(req, res, 500, err));
      }
    });
  })
}
