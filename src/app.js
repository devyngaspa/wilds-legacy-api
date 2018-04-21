express         = require('express');
APP             = express();
Initialize      = require('./initializers/_base')

var path         = require('path');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var http         = require('http');
var debug        = require('debug')('wilds-api:server');
var socketio     = require('socket.io')
var passport     = require('passport')
var session      = require('express-session')

const secrets  = require('./config/secrets')


var port = normalizePort(process.env.PORT || '3000');
APP.set('port', port);

HTTPSERV = http.createServer(APP);

HTTPSERV.listen(port);
HTTPSERV.on('error', onError);
HTTPSERV.on('listening', onListening);

io = socketio(HTTPSERV);

// If you have your node.js behind a proxy and are using secure: true, you need to set "trust proxy" in express:
APP.set('trust proxy', 1)

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
APP.use(logger('dev'));
APP.use(bodyParser.json());
APP.use(bodyParser.urlencoded({ extended: true }));
APP.use(cookieParser(secrets.session.cookie_key));
APP.use(express.static(path.join(__dirname, 'public')));

APP.use(session({
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
  secret: secrets.session.cookie_key,
  resave: false,
  saveUninitialized: true
}));

APP.use(passport.initialize());
APP.use(passport.session());

APP.use( (request, response, next) => {
  if (request.session && request.session.cookie && request.session.cookie.expires > new Date()) {
    next();
  }
  else {
    this.response.sendStatus(423);
    this.response.end();
  }
})


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = HTTPSERV.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}



// view engine setup
APP.set('views', path.join(__dirname, 'views'));
APP.set('view engine', 'jade');

Initialize.app()

// catch 404 and forward to error handler
APP.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
APP.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = APP;
