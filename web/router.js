var express = require('express');
const registerRouter = require('./register/routes' );
const personalRouter = require('./personal_information/routes' );
const bankAccountRouter = require('./bank_account/routes' );
const clientRouter = require('./client/routes' );
const employeeRouter = require('./employee/routes');
const scheduleRouter = require('./schedule/routes');
const billRouter = require('./bill/routes');
const salaryRouter = require('./salary/routes');
const warehouseRouter = require('./warehouse/routes');
const contractRouter = require('./contract/routes');
const installationRouter = require('./installation/routes');
const paymentRouter = require('./payment/routes');

const appRouter = express.Router();


appRouter.use(registerRouter);
appRouter.use(personalRouter);
appRouter.use(bankAccountRouter);
appRouter.use(clientRouter);
appRouter.use(employeeRouter);
appRouter.use(scheduleRouter);
appRouter.use(billRouter);
appRouter.use(salaryRouter);
appRouter.use(warehouseRouter);
appRouter.use(contractRouter);
appRouter.use(installationRouter);
appRouter.use(paymentRouter);

module.exports = appRouter;