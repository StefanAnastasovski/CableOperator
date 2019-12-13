let express = require('express');
const actions = require('./actions');

let routes = express.Router();

routes.post('/schedule', actions.createMonthlySchedule);
routes.get('/schedule', actions.getMonthlySchedule);
routes.post('/schedule/year/:year/month/:month', actions.createScheduleForSpecificMonth);
routes.get('/schedule/year/:year/month/:month/day/:day', actions.getMonthlySchedule);
routes.get('/schedule/year/:year/month/:month', actions.getMonthlySchedule);
routes.get('/schedule/umcn/:umcn/year/:year/month/:month', actions.getMonthlySchedule);


module.exports = routes;