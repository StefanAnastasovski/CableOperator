let express = require('express');
const actions = require('./actions');

let routes = express.Router();

routes.post('/personalInformation', actions.createPersonalInformation);
routes.get('/personalInformation', actions.getPersonalInformation);
routes.patch('/personalInformation/:umcn', actions.changePersonalInformation);

module.exports = routes;