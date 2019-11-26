let express = require('express');
const actions = require('./actions');

let routes = express.Router();

routes.get('/bankAccount', actions.getAllBankAccounts);
routes.get('/bankAccount/:accNumber', actions.getSpecificBankAccount);
routes.post('/bankAccount', actions.createBankAccount);
routes.patch('/bankAccount/:accNumber/balance', actions.changeBankAccount);

module.exports = routes;