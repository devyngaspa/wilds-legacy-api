const fs = require('fs')

function print_initializer (file_name) {
  console.log("Running initializer '" + file_name + "'");
}

module.exports = {

  initialize: () => {
    let promises = new Array();
    let file_names = fs.readdirSync('./initializers');
    file_names.shift(); // remove _base.js
    file_names.forEach( (file_name) => {
      let initializer = require('../initializers/' + file_name)
      print_initializer(file_name);
      promises.push(initializer.initialize());
    });
    return Promise.all(promises)
  }
}
