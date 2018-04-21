module.exports = {

  find_many_by_id: (model, ids, preserve_order=false) => {
    return new Promise( (resolve, reject) => {
      object_ids = whelp.model.ids_to_object_ids(ids);
      model.find({'_id': { $in: object_ids}}, (err, documents) => {
        if (err) { console.error(err); reject(err); }
        if (preserve_order) {
          documents.sort( (a, b) => {
            ai = ids.indexOf(a.get('id'))
            bi = ids.indexOf(b.get('id'))
            if (ai < bi) { return -1; }
            else if (ai > bi ) { return 1; }
            else { return 0; }
          });
          resolve(documents);
        }
        else {resolve(documents); }
      });
    });
  },

  get_model_namespace: (model_name) => {
    let dir_names = fs.readdirSync(SRCPATH + '/models');
    let ns = null;
    dir_names.forEach( (dir_name) => {
      let file_names = fs.readdirSync(SRCPATH + '/models/' + dir_name);
      file_names.forEach( (file_name) => {
        if (model_name === file_name.slice(0, -3)) { ns = dir_name; }
      });
    });
    return ns;
  },

  constantize_model: (model_name) => {
    ns    = whelp.model.get_model_namespace(model_name);
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

  find_or_create: (model, params) => {
    return new Promise( (resolve, reject) => {
      model.findOne(params).then( (document) => {
        if (document) { resolve(document); }
        else {
          model.create(params).then( (new_document) => {
            resolve(new_document);
          });
        }
      });
    });
  },

  id_to_object_id: (id) => { return mongoose.Types.ObjectId(id); },

  ids_to_object_ids: (ids) => { return ids.map(id => whelp.model.id_to_object_id(id)); }

}
