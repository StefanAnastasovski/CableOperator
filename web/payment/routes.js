let express = require('express');
const actions = require('./actions');

let routes = express.Router();

routes.post('/payment', actions.createPayment);
routes.get('/payment', actions.getAllPaymentsFromCurrentDay);
routes.get('/payment/year/:year/month/:month/day/:day', actions.getAllPaymentsByDate);
routes.get('/payment/client/:umcn', actions.getAllPaymentsByClient);

module.exports = routes;