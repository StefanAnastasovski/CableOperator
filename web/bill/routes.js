let express = require('express');
const actions = require('./actions');

let routes = express.Router();

// routes.post('/bills/:umcn', actions.createBills);
routes.get('/bills/client/:umcn', actions.getAllBills);
routes.get('/bill/client/:umcn/year/:year/month/:month', actions.getBillForSpecificClient);
routes.patch('/bill/client/:umcn/year/:year/month/:month', actions.changeIsPaidBill);

module.exports = routes;