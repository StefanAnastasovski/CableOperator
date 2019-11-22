let express = require('express');
const actions = require('./actions');

let routes = express.Router();

routes.get('/register', actions.getRegisterInfo);
routes.get('/register/:id', actions.getRegisterInfoSpecificTerminal);
routes.get('/register/:id/isBusy/:isBusy', actions.CheckRegisterIsBusy);
routes.get('/register/isBusy/:isBusy', actions.CheckRegisterIsBusy);
routes.get('/register/balance/:id', actions.getRegisterBalanceCurrentDay);
routes.get('/register/balance/:id/month/:month', actions.getRegisterBalanceSpecificMonth);
routes.get('/register/balance/month/:month', actions.getRegisterBalanceSpecificMonth);
routes.patch('/register/:id', actions.registerChange);



module.exports = routes;