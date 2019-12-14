let express = require('express');
const actions = require('./actions');

let routes = express.Router();

routes.get('/register', actions.getRegisterInfo);
routes.post('/register', actions.createRegisterForToday);
routes.get('/register/:terminal', actions.getRegisterInfoSpecificTerminal);
routes.get('/register/:terminal/isBusy/:isBusy', actions.checkRegisterIsBusy);
routes.get('/register/isBusy/:isBusy', actions.checkRegisterIsBusy);
routes.get('/register/balance/:terminal', actions.getRegisterBalanceCurrentDay);
routes.get('/register/balance/:terminal/month/:month', actions.getRegisterBalanceSpecificMonth);
routes.get('/register/balance/month/:month', actions.getRegisterBalanceSpecificMonth);
routes.patch('/register/terminal/:terminal', actions.registerChange);
routes.patch('/register/balance', actions.enterBalanceInBankAccount);



module.exports = routes;