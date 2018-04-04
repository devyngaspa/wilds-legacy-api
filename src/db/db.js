const seeds    = require('./seed');
const teardown = require('./teardown');

function get_singular_ref_method(model_name, prop) {
  return function() {
    promise = new Promise( (resolve, reject) => {
      model = whelp.model.constantize_model(model_name);
      model.findById(this[prop]).then( (document) => {
        resolve(document);
      });
    });
    return promise;
  };
}

function get_many_ref_method(model_name, prop) {
  return function() {
    model = whelp.model.constantize_model(model_name);
    promise = new Promise( (resolve, reject) => {
      whelp.model.find_many_by_id(model, this[prop]).then( (documents) => {
        resolve(documents);
      })
    })
    return promise;
  };
}

class Wdb {

  constructor(mgdb, seed) {
    this.mgdb = mgdb;
    this.seed = seed;
  };

  reset() {
    return new Promise( (resolve, reject) => {
      wlog("Resetting database...");
      this.drop().then( () => {
        this.populate().then( () => {
          wlog("Reset database");
          resolve();
        });
      });
    });
  }

  populate() {
    return new Promise( (resolve, reject) => {
      wlog("Populating database...");
      seeds.populate(this.seed).then( () => {
        wlog("Populated database");
        resolve();
      });
    });
  }


  drop() {
    return new Promise( (resolve, reject) => {
      wlog("Dropping database...");
      teardown.drop(this.mgdb).then( () => {
        wlog("Dropped database");
        resolve();
      });
    });
  }

  static schema(...args) {
    let attrs = args[0]
    let mg_schema = new mongoose.Schema(...args);
    Object.keys(attrs).forEach( (key) => {
      let value   = attrs[key];
      let fn_name = null;
      let fn      = null;
      if (key.endsWith('_id')) {
        let model_name = inflection.underscore(value.ref);
        fn_name        = key.slice(0, -3);
        fn             = get_singular_ref_method(model_name, key);
      }
      else if (key.endsWith('_ids')) {
        let model_name = inflection.underscore(value[0].ref);
        fn_name        = inflection.pluralize(key.slice(0, -4));
        fn             = get_many_ref_method(model_name, key);
      }
      if (fn_name && fn) { mg_schema.methods[fn_name] = fn; }
    });
    return mg_schema
  }
}

module.exports = Wdb;
