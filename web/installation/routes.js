let express = require('express');
const actions = require('./actions');

let routes = express.Router();

routes.get('/installation', actions.getAllInstallations);
routes.get('/installation/year/:year/month/:month', actions.getAllInstallationsByDate);
routes.get('/installation/year/:year/month/:month/day/:day', actions.getAllInstallationsByDate);
routes.patch('/installation/isFinished/:isFinished', actions.changeIsFinished);

module.exports = routes;