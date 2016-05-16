import chalk from 'chalk';

// http response
export const response = (req, res, status, json) => {
  res.status = status;
  if (json) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(json));
  }
}
export const ok = (req, res, json) => {
  console.log(chalk.blue.bold('ok'), req.url, json);
  response(req, res, 200, json);
}
export const error = (req, res, status = 500, json) => {
  console.log(chalk.red('error'), req.url, json);
  response(req, res, status, json);
}
export const notAuth = (req, res, json) => error(req, res, 401, json)
export const notFound = (req, res, json) => response(req, res, 404, json)
export const serverError = (req, res, json) => response(req, res, 500, json)

