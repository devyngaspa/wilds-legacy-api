module.exports = {

  initialize: () => {
    promise = new Promise( (resolve, reject) => {
      mongoose.connect('mongodb://localhost/wilds_dev');
      mgdb = mongoose.connection
      mgdb.on('error', console.error.bind(console, 'connection error:'));
      mgdb.once('open', function() {
      });

      let seed = 'battle1'
      let db = new Wdb(mgdb, seed);
      db.reset().then( 
        () => { resolve(); }
      );
    });
    return promise
  }

}
