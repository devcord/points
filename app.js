const Koa = require('koa');
const logger = require('koa-logger');
const Router = require('koa-router');
var bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');

const app = new Koa();

// log all events to the terminal
app.use(logger());

app.use(bodyParser());

// error handling
app.use(async (ctx, next) => {
  ctx.body = ctx.request.body;

  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});

mongoose.connect('mongodb://127.0.0.1:27017/points', { useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// instantiate our new Router
const router = new Router();
// require our external routes and pass in the router
require('./routes/basic')({ router });
require('./routes/user')({ router });


// tells the router to use all the routes that are on the object
app.use(router.routes());
app.use(router.allowedMethods());

// tell the server to listen to events on a specific port
const server = app.listen(3000);
module.exports = server;