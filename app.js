const Koa = require('koa');
const logger = require('koa-logger');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
require('dotenv').config();

const errorHandler = require('./utils/errorHandler');
const authHandler = require('./utils/authHandler');

const app = new Koa();

app.use(errorHandler);
app.use(authHandler);

// log all events to the terminal
app.use(logger());

app.use(bodyParser());

mongoose.connect(`${process.env.MONGO_URL}`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// instantiate our new Router
const router = new Router();


// require our external routes and pass in the router
require('./routes/basic')({ router });
require('./routes/user')({ router });
require('./routes/thanks')({ router });


// tells the router to use all the routes that are on the object
app.use(router.routes());
app.use(router.allowedMethods());

// tell the server to listen to events on a specific port
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
module.exports = server;
