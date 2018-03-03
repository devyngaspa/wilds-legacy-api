express      = require('express');
inflection   = require('inflection');
fs           = require('fs')
path         = require('path');
favicon      = require('serve-favicon');
logger       = require('morgan');
cookieParser = require('cookie-parser');
bodyParser   = require('body-parser');
mongoose     = require('mongoose');
Wdb          = require('../db/db')
whelp        = require('../helpers/common')
wlog         = function(...args) { console.log(...args); }

module.exports = {

  initialize: () => {
    promise = new Promise( (resolve, reject) => {
      resolve()
    });
    return promise;
  }

}
