inflection   = require('inflection');
fs           = require('fs')
path         = require('path');
favicon      = require('serve-favicon');
logger       = require('morgan');
cookieParser = require('cookie-parser');
bodyParser   = require('body-parser');
mongoose     = require('mongoose');
socketio     = require('socket.io')

Wdb             = require('../db/db');
whelp           = require('../helpers/common');
wlog            = function(...args) { console.log(...args); };

Simulate        = require('../lib/simulate');
Load            = require('../lib/load');
Emit            = require('../lib/emit');
Log             = require('../lib/log');

Simulation      = require('../lib/simulation');
Decider         = require('../lib/decide');
Waction         = require('../lib/action');
Weffect         = require('../lib/effect');
WEventReceiver  = require('../websocket/receivers/base')
WEventEmitter   = require('../websocket/emitters/base')

SRCPATH         = './src'

module.exports = {

  initialize: () => {
    return;
  }

}
