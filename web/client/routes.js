let express = require('express');
const actions = require('./actions');

let routes = express.Router();

routes.get('/clients', actions.getAllClientsInfo);
routes.get('/client/:umcn', actions.getSpecificClientInfo);
routes.get('/clientInfo', actions.getClientTableInfo);
routes.get('/clientsStatus/:status', actions.getClientsStatus);
routes.post('/client', actions.createClient);
routes.patch('/clientStatus/:umcn', actions.changeClient);
// routes.delete('/client', actions.deleteClient);

module.exports = routes;