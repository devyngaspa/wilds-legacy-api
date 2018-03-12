module.exports = {

  initialize: () => {
    let file_names = fs.readdirSync(SRCPATH + '/routes');
    file_names.forEach( (file_name) => {
      let resource = file_name.slice(0, -3);
      let routes   = require('../routes/' + resource)
      APP.use(routes.path, routes.router);
    })
  }

}
