let express = require('express');
const actions = require('./actions');

let routes = express.Router();

routes.get('/employees', actions.getAllEmployeesInfo);
routes.get('/employee/:umcn', actions.getSpecificEmployeeInfo);
routes.post('/employee', actions.createEmployee);
routes.get('/employees/status/:status', actions.getAllEmployeesWorkStatus);
routes.get('/employees/type/:type', actions.getAllEmployeesByType);
routes.patch('/employee/:umcn', actions.changeEmployeeStatusOrBonus);
// routes.delete('/employee', actions.deleteEmployee);

module.exports = routes;