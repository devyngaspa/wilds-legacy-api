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
      object_ids = ids.map(id => mongoose.Types.ObjectId(id));
      model.find({'_id': { $in: object_ids}}, (err, documents) => {
        if (err) { console.error(err); reject(err); }
        resolve(documents)
      });
    });
  },

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
  }


}
