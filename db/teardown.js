function get_all_models () {
  models = new Array();
  let dir_names = fs.readdirSync('./models');
  dir_names.forEach( (dir_name) => {
    let file_names = fs.readdirSync('./models/' + dir_name);
    file_names.forEach( (file_name) => {
      let model = require('../models/' + dir_name + '/' + file_name);
      models.push(model);
    });
  });

  return models;
}

module.exports = {

  drop: function (database) {
    let promises = new Array();
    models = get_all_models()
    models.forEach(function (model) {
      promises.push(model.remove({}));
    });
    return Promise.all(promises);
  }

};
