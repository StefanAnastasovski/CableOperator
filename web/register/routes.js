let express = require('express');
const actions = require('./actions');

let routes = express.Router();

routes.get('/register', actions.getRegisterInfo);
routes.get('/register/:terminal', actions.getRegisterInfoSpecificTerminal);
routes.get('/register/:terminal/isBusy/:isBusy', actions.CheckRegisterIsBusy);
routes.get('/register/isBusy/:isBusy', actions.CheckRegisterIsBusy);
routes.get('/register/balance/:terminal', actions.getRegisterBalanceCurrentDay);
routes.get('/register/balance/:terminal/month/:month', actions.getRegisterBalanceSpecificMonth);
routes.get('/register/balance/month/:month', actions.getRegisterBalanceSpecificMonth);
routes.patch('/register/:terminal', actions.registerChange);



module.exports = routes;