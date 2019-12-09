let express = require('express');
const actions = require('./actions');

let routes = express.Router();

routes.get('/warehouse', actions.getWarehouseInfo);
routes.post('/warehouse', actions.enterInfoInWarehouse);

module.exports = routes;