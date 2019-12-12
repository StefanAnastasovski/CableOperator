let express = require('express');
const actions = require('./actions');

let routes = express.Router();

routes.get('/contract', actions.getAllContracts);
routes.get('/contract/client/:umcn', actions.getContractsForSpecificClient);
routes.get('/contract/service/:service', actions.getContractsByService);
routes.post('/contract/employee/:umcn', actions.createContract);


module.exports = routes;