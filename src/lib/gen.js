function get_default(model_name, attr, defaults, params={}) {
  return new Promise( (resolve, reject) => {
    resolve(defaults[attr])
  });
}

function get_value_for_attr(model_name, attr, defaults, params={}) {
  return new Promise( (resolve, reject) => {
    let obj = {};
    if (params[attr]) { 
      obj[attr] = params[attr];
      resolve(obj);
    }
    else {
      get_default(model_name, attr, defaults, params).then( (value) => {
        obj[attr] = value;
        resolve(obj);
      })
    }
  }) 
}

function get_attrs_for_model(model, options) {
  let attrs = Object.keys(model.schema.paths).slice(0, -2) // remove _id and _v
  if (options.attr_order) { 
    return options.attr_order.concat(attrs.filter((attr) => { return !options.attr_order.includes(attr) }));
  }
  else { return attrs; }
}


class Gen {

  static default_obj(model, params, options) {
    return new Promise( (resolve, reject) => {
      let model_name = model.modelName
      let attrs      = get_attrs_for_model(model, options)
      let defaults   = require('../lib/gen/' + inflection.underscore(model_name) + '/defaults');
      let promises   = attrs.map((attr) => { return get_value_for_attr(model_name, attr, defaults, params); })
      Promise.all(promises).then( (values) => {
        resolve(Object.assign({}, ...values));
      });
    });
  }

  static sample_obj(model, params, default_obj, options) {
    return new Promise( (resolve, reject) => {
      let model_name  = model.modelName;
      let attrs       = get_attrs_for_model(model, options);
      let samples     = require('../lib/gen/' + inflection.underscore(model_name) + '/samples');
      let obj         = {}
      let keys        = attrs.filter((attr) => { return samples[attr] && !params[attr]; })
      let promise_fns = keys.map((key) => { return (() => { return this.sample(samples, key, default_obj, obj, params, options); }) })
      let itr         = {i: 0}

      whelp.promise.all_with_order(promise_fns, ((value, itr, obj, keys) => { 
          let key  = keys[itr.i];
          obj[key] = value;
          itr.i    = itr.i + 1
        }), itr, obj, keys).then( (after) => {
        resolve(obj);
      })
    });
  }

  static sample(samples, attr, default_obj, sample_obj, params, options) {
    return new Promise( (resolve, reject) => {
      let sample_objs = samples[attr];
      if (whelp.is_function(sample_objs)) {
        let sample_fn = sample_objs;
        sample_fn(default_obj, sample_obj, params, options).then( (sample_objs) => {
          let value = whelp.array.sample(this.get_sample_pool(sample_objs));
          resolve(value);
        })
      }
      else if (Array.isArray(sample_objs)) {
        let value = whelp.array.sample(this.get_sample_pool(sample_objs));
        resolve(value);
      }
      else { throw 'Samples are unknown type'; }
    });
  }

  static get_sample_pool (samples) {
    let values   = samples.map((sample_obj) => {
      let weight = sample_obj.weight || 1;
      return Array(weight).fill(sample_obj.value, 0, weight);
    })
    return whelp.array.flatten(values);
  }

  static quest(params={}, options={}) {
    return (new GenQuest(params, options)).process();
  }

  static character(params={}, options={}) {
    return (new GenCharacter(params, options)).process();
  }

}

class GenQuest {

  constructor(params, options={}) {
    this.params   = params;
    this.options  = options;
    this.document = null;
  }

  process () {
    return new Promise( (resolve, reject) => {
      Gen.default_obj(Quest, this.params, this.options).then( (dobj) => {
        Gen.sample_obj(Quest, this.params, dobj, this.options).then( (sobj) => {
          let obj = Object.assign({}, dobj, sobj, this.params);
          Quest.create(obj).then( (quest) => {
            resolve(quest);
          });
        });
      });
    });
  }

}

class GenCharacter {

  constructor(params, options={}) {
    this.params     = params;
    this.document   = null;
    this.options    = Object.assign({}, options, {attr_order: ['gender', 'character_tmpl_id']});
  }

  sync_character_tmpl(character) {
    return new Promise( (resolve, reject) => {
      CharacterTmpl.findById(character.character_tmpl_id).then( (character_tmpl) => {
        character.role = character_tmpl.role;
        character.save().then( () => {
          resolve(character);
        });
      });
    });
  }

  process () {
    return new Promise( (resolve, reject) => {
      Gen.default_obj(Character, this.params, this.options).then( (dobj) => {
        Gen.sample_obj(Character, this.params, dobj, this.options).then( (sobj) => {
          let obj = Object.assign({}, dobj, sobj, this.params);
          Character.create(obj).then( (character) => {
            this.sync_character_tmpl(character).then( () => {
              character.birth().then( () => {
                this.options.player.character_ids.push(character.id);
                this.options.player.save().then( () => {
                  resolve(character);
                });
              });
            });
          });
        });
      });
    });
  }

}


module.exports = Gen;
