let express = require('express');
const actions = require('./actions');

let routes = express.Router();

routes.get('/salary', actions.getPayrolls);
routes.get('/salary/:umcn', actions.getPayrolls);
routes.get('/salary/year/:year/month/:month', actions.getPayrolls);
routes.post('/salary/employee/:umcn', actions.addSalaryForSpecificEmployeeAndMonth);
routes.post('/salary', actions.createMonthlyPayroll);

module.exports = routes;