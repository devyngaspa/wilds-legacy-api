module.exports = {

  initialize: () => {
    let dir_names = fs.readdirSync(SRCPATH + '/models');

    dir_names.forEach(function(dir_name) {
      let file_names = fs.readdirSync(SRCPATH + '/models/' + dir_name);

      file_names.forEach( (file_name) => {
        let model_name = file_name.slice(0, -3);
        let model      = require('../models/' + dir_name + '/' + model_name);
      });
    });
  }

}
