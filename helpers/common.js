module.exports = {

  copy_obj_array: (array) => {
    if (!Array.isArray(array)) { return null; }
    new_array = new Array();
    array.forEach( (element, i) => {
      obj = Object.assign({}, element);
      new_array[i] = obj;
    });
    return new_array;
  },

  find_many_by_id: (model, ids) => {
    return new Promise( (resolve, reject) => {
      object_ids = whelp.ids_to_object_ids(ids);
      model.find({'_id': { $in: object_ids}}, (err, documents) => {
        if (err) { console.error(err); reject(err); }
        resolve(documents)
      });
    });
  },

  id_to_object_id: (id) => { return mongoose.Types.ObjectId(id); },

  ids_to_object_ids: (ids) => { return ids.map(id => whelp.id_to_object_id(id)); },

  get_model_namespace: (model_name) => {
    let dir_names = fs.readdirSync('./models');
    let ns = null;
    dir_names.forEach( (dir_name) => {
      let file_names = fs.readdirSync('./models/' + dir_name);
      file_names.forEach( (file_name) => {
        if (model_name === file_name.slice(0, -3)) { ns = dir_name; }
      });
    });
    return ns;
  },

  constantize_model: (model_name) => {
    ns    = whelp.get_model_namespace(model_name);
    model = require('../models/' + ns + '/' + model_name);
    return model;
  },

  find_first: (model, ...args) => {
    return new Promise( (resolve, reject) => {
      model.find(...args).then( (results) => {
        if (!results) { return null; }
        else { resolve(results[0]); }
      });
    });
  },

  promise_hash: (obj) => {
    return new Promise( (resolve, reject) => {
      let keys     = Object.keys(obj);
      let promises = new Array();
      let indicies = {};
      keys.forEach( (key) => {
        let value = obj[key];
        if (Array.isArray(value)) {
          indicies[key]       = {};
          indicies[key].begin = promises.length;
          promises            = promises.concat(value);
          indicidies[key].end = promises.length - 1;
        }
        else {
          promises.push(value);
          indicies[key] = {begin: (promises.length - 1), end: promises.length};
        }
      })

      Promise.all(promises).then( (results) => {
        let hash = {};
        keys.forEach( (key) => {
          begin     = indicies[key].begin;
          end       = indicies[key].end;
          hash[key] = results.slice(begin, end);
          if (hash[key].length === 1) { hash[key] = hash[key][0]; }
        })
        resolve(hash);
      })
    });
  },

  set_from_options: (obj, options) => {
    Object.keys(options).forEach( (key) => {
      obj[key] = options[key];
    });
    return obj;
  },

  flatten: (arrays) => { return [].concat.apply([], arrays); },

  sort_by: (array, property) => {
    return array.sort( (a, b) => {
      if (a[property] > b[property]) { return -1; }
      else if (a[property] < b[property]) { return 1; }
      else { return 0; }
    });
  },

  find_by: (array, property, value, invert=false) => {
    for(let i = 0; i < array.length; i++) {
      let element = array[i];
      if (value === undefined) {
        if (element[property]) { return element; }
      }
      else {
        if (invert) {
          if (element[property] !== value) { return element; }
        }
        else {
          
          if (element[property] === value) { return element; }
        }
      }
    };
    return null;
  },

  map_by: (array, property) => {
    return array.map( (element) => { return element[property]; });
  }


}
