var express = require('express');
var registerRouter = require('./register/routes' );
var personalRouter = require('./personal_information/routes' );
var bankaccountRouter = require('./bank_account/routes' );
var clientRouter = require('./client/routes' );
var employeeRouter = require('./employee/routes');


const appRouter = express.Router();

//
appRouter.use(registerRouter);
appRouter.use(personalRouter);
appRouter.use(bankaccountRouter);
appRouter.use(clientRouter);
appRouter.use(employeeRouter);


module.exports = appRouter;