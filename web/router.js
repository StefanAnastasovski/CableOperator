var express = require('express');
var registerRouter = require('./register/routes' );


const appRouter = express.Router();

//
appRouter.use(registerRouter);


module.exports = appRouter;