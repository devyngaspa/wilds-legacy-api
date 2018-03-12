const fs      = require('fs')
const SRCPATH = './src'

class Initialize {

  static print_initializer (file_name) {
    let initializer_name = file_name.slice(2, -3);
    console.log("Running initializer '" + initializer_name + "'");
  }

  static app() {
    let file_names = fs.readdirSync(SRCPATH + '/initializers');
    file_names.shift(); // remove _base.js
    file_names.forEach( (file_name) => {
      let initializer = require('../initializers/' + file_name)
      this.print_initializer(file_name);
      initializer.initialize();
    });
  }
}

module.exports = Initialize;
