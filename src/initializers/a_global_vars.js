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

QUEST_DIFFICULTY_EASY   = 'easy'
QUEST_DIFFICULTY_MEDIUM = 'medium'
QUEST_DIFFICULTY_HARD   = 'hard'

QUEST_OBJECTIVE_HUNT    = 'hunt'
QUEST_OBJECTIVE_FORAGE  = 'forage'
QUEST_OBJECTIVE_EXPLORE = 'explore'
QUEST_OBJECTIVE_RESCUE  = 'rescue'

ITEM_TMPL_TYPE_CONSUMABLE = 'consumable'
ITEM_TMPL_TYPE_PERMANENT  = 'permanent'

ITEM_TMPL_CONTEXT_ENCOUNTER = 'encounter'
ITEM_TMPL_CONTEXT_ALL       = 'all'

module.exports = {

  initialize: () => {
    return;
  }

}
