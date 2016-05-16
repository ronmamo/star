import chalk from 'chalk';
import usersRouter from './usersRouter';
import sequelizeRouter from './sequelizeRouter';

const logRoutes = router => {
  console.log(chalk.green.bold('added routes:'));
  router.stack.forEach(r => {
    if (r.route && r.route.path) {
      console.log(chalk.green(`\t${r.route.stack[0].method.toUpperCase()}`), `\t${r.route.path}`);
    }
  })
};

export default (router, models) => {
  usersRouter(router);
  sequelizeRouter(router, models);
  logRoutes(router);

  return router;
}

