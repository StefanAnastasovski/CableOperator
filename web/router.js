var express = require('express');
const registerRouter = require('./register/routes' );
const personalRouter = require('./personal_information/routes' );
const bankAccountRouter = require('./bank_account/routes' );
const clientRouter = require('./client/routes' );
const employeeRouter = require('./employee/routes');
const scheduleRouter = require('./schedule/routes');


const appRouter = express.Router();


appRouter.use(registerRouter);
appRouter.use(personalRouter);
appRouter.use(bankAccountRouter);
appRouter.use(clientRouter);
appRouter.use(employeeRouter);
appRouter.use(scheduleRouter);


module.exports = appRouter;