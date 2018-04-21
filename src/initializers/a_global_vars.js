inflection     = require('inflection');
fs             = require('fs')
path           = require('path');
favicon        = require('serve-favicon');
logger         = require('morgan');
cookieParser   = require('cookie-parser');
bodyParser     = require('body-parser');
mongoose       = require('mongoose');
socketio       = require('socket.io')
moment         = require('moment')
passport       = require('passport')
GoogleStrategy = require('passport-google-oauth20')
session        = require('express-session')

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
Woutcome        = require('../lib/outcome');
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

CHARACTER_NAMES   = require('../consts/character_names')
CHARACTER_GENDERS = require('../consts/character_genders')
CHARACTER_ROLES   = require('../consts/character_roles')
CHARACTER_STATS   = require('../consts/character_stats')
CHARACTER_GROWTH  = require('../consts/character_growth')

EXPEDITION_OUTCOMES = require('../consts/expedition_outcomes')
EXPEDITION_MOCK     = require('../consts/expedition_mock')

QUEST_THREATS  = require('../consts/quest_threats')


module.exports = {

  initialize: () => {
    return;
  }

}
