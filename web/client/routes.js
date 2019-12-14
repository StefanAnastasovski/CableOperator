let express = require('express');
const actions = require('./actions');

let routes = express.Router();

routes.get('/clients', actions.getAllClientsInfo);
routes.get('/client/:umcn', actions.getSpecificClientInfo);
routes.get('/client/info', actions.getClientTableInfo);
routes.get('/clients/status/:status', actions.getClientsStatus);
routes.post('/client', actions.createClient);
routes.patch('/client/status/:umcn', actions.changeClient);
// routes.delete('/client/:umcn', actions.deleteClient);

module.exports = routes;