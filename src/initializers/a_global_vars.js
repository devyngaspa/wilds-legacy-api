inflection   = require('inflection');
fs           = require('fs')
path         = require('path');
favicon      = require('serve-favicon');
logger       = require('morgan');
cookieParser = require('cookie-parser');
bodyParser   = require('body-parser');
mongoose     = require('mongoose');
socketio     = require('socket.io')
moment       = require('moment')
fantasy      = require('fantasy-names')

Wdb             = require('../db/db');
whelp           = require('../helpers/base');
wlog            = function(...args) { console.log(...args); };

Simulate        = require('../lib/simulate');
Load            = require('../lib/load');
Emit            = require('../lib/emit');
Log             = require('../lib/log');
Gen             = require('../lib/gen');

Simulation      = require('../lib/simulation');
Decider         = require('../lib/decide');
Waction         = require('../lib/action');
Weffect         = require('../lib/effect');
WEventReceiver  = require('../websocket/receivers/base')
WEventEmitter   = require('../websocket/emitters/base')

SRCPATH         = './src'

DIFFICULTY_EASY   = 'easy'
DIFFICULTY_MEDIUM = 'medium'
DIFFICULTY_HARD   = 'hard'

module.exports = {

  initialize: () => {
    return;
  }

}
