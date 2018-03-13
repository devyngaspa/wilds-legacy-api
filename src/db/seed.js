var model_map = {};
var relationship_map = [];

function initialize_model_map (dir) {
  let dir_names = fs.readdirSync(SRCPATH + '/db/seeds/' + dir);

  dir_names.forEach(function(dir_name) {

    let model_name = inflection.singularize(dir_name);
    model_name     = inflection.classify(model_name);
    let file_names = fs.readdirSync(SRCPATH + '/db/seeds/' + dir + '/' + dir_name);

    file_names.forEach(function(file_name) {
      let identifier = file_name.slice(0, -5);

      model_map[model_name] = model_map[model_name] || {}
      model_map[model_name][identifier] = null;
    });
  });
}

function insert_into_model_map (model_name, document, identifier) {
  let model        = inflection.classify(model_name);
  model_map[model] = model_map[model] || {};
  let id           = [inflection.underscore(model_name), identifier].join('_')
  model_map[model][id] = document;
}

function insert_into_relationship_map (document, relationships) {
  if (!relationships || !relationships.length) { return; }
  relationship_map.push({
    'document': document,
    'relationships': relationships
  });
}

function get_model_namespace (model_name) {
  let dir_names = fs.readdirSync(SRCPATH + '/models');
  let ns = null;
  dir_names.forEach( (dir_name) => {
    let file_names = fs.readdirSync(SRCPATH + '/models/' + dir_name);
    file_names.forEach( (file_name) => {
      if (model_name === file_name.slice(0, -3)) { ns = dir_name; }
    });
  });
  return ns;
}

function constantize_model (model_name) {
  ns    = get_model_namespace(model_name)
  model = require('../models/' + ns + '/' + model_name)
  return model
}

function print_seed (model_name, document, identifier, err=null) {
  class_name = inflection.classify(model_name);

  if (err) return console.error('Failed to seed ' + class_name + ': ', err, document)

  wlog('Seeded ' + class_name + ': ' + [model_name, identifier].join('_') + ' ' + document._id);
  return document

}

function print_error (message, ...args) {
  console.error(message, ...args);
}

function error_no_model_for_identifier(identifier) {
  return 'No model found for identifier \'' + identifier + '\'';
}

function seed_models_from_json (dir) {

  let dir_names = fs.readdirSync(SRCPATH + '/db/seeds/' + dir);
  let promises = new Array();

  dir_names.forEach(function(dir_name) {

    let model_name = inflection.singularize(dir_name);
    let model      = constantize_model(model_name);
    let file_names = fs.readdirSync(SRCPATH + '/db/seeds/' + dir + '/' + dir_name);

    file_names.forEach(function(file_name) {

      let obj           = JSON.parse(fs.readFileSync(SRCPATH + '/db/seeds/' + dir + '/' + dir_name + '/' + file_name));
      let identifier    = file_name.slice(0, -5);
      let relationships = whelp.copy_obj_array(obj.relationships)
      delete obj.relationships;
      let promise       = model.create(obj)

      promise.then( (document) => {
        print_seed(model_name, document, identifier);
        insert_into_model_map(model_name, document, identifier);
        insert_into_relationship_map(document, relationships);
      })
      promises.push(promise);
    });
  });

  return Promise.all(promises);

}

function relationship_is_polymorphic(relationship) { return relationship.key.endsWith('able'); }

function hook_up_relationships() {
  let promises = new Array();
  relationship_map.forEach( (rel) => {
    let document      = rel.document;
    let relationships = rel.relationships;
    relationships.forEach( (relationship) => {
      let key        = relationship.key
      let value      = relationship.value;
      if (relationship_is_polymorphic(relationship)) {
        let model_name = value.split('_')[0];
        let model      = model_map[inflection.classify(model_name)];
        if (!model[value]) { throw error_no_model_for_identifier(value); }
        let id         = model[value]._id;
        document[key]  = { id: id, type: model_name};
      }
      else {
        let model_name = key.split('_').slice(0, -1).join('_');
        model_name     = inflection.classify(model_name);
        let model      = model_map[model_name];
        if (Array.isArray(value)) {
          value.forEach( (identifier) => {
            if (!model[identifier]) { throw error_no_model_for_identifier(identifier); }
            let id = model[identifier]._id;
            document[key].push(id);
          });
        }
        else {
          if (!model[value]) { throw error_no_model_for_identifier(value); }
          let id        = model[value]._id;
          document[key] = id;
        }
      }
    });
    promises.push(document.save())
  });

  return Promise.all(promises);
}



module.exports = {

  populate: function (seed) {
    let promise = new Promise( (resolve, reject) => {
      let promises  = new Array();
      initialize_model_map('domain');
      initialize_model_map(seed);

      promises.push(seed_models_from_json('domain'));
      promises.push(seed_models_from_json(seed));

      Promise.all(promises).then( () => {
        hook_up_relationships().then( () => {
          resolve();
        });
      });
    });

    return promise;
  }
}


