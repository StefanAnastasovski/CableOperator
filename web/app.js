let express = require('express');
let bodyParser = require('body-parser');

const middleware = require('./middlewares/mwcommon');
const appRouter = require('./router');

require('dotenv/config');

const app = express();

// app body
app.use(middleware.logger);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.use('/', appRouter);

// app.use('/register/:id', middleware.emptyBody);

app.use(middleware.wrongRoute);
// app.use(middleware.emptyBody);


app.use(middleware.errorHandler);


var port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`API is listenig on port ${port}!`);
});