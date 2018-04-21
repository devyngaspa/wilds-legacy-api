const array      = require('./array')
const object     = require('./object')
const model      = require('./model')
const promise    = require('./promise')
const file       = require('./file')
const rand       = require('./rand')
const middleware = require('./middleware')

module.exports = {

  array:      array,
  object:     object,
  model:      model,
  promise:    promise,
  file:       file,
  rand:       rand,
  middleware: middleware,

  is_function(fn) {
    return fn && {}.toString.call(fn) === '[object Function]';
  }

}


