module.exports = {

  initialize: () => {
    mongoose.connect('mongodb://localhost/wilds_dev');
    mgdb = mongoose.connection
    mgdb.on('error', console.error.bind(console, 'connection error:'));
    mgdb.once('open', function() {
    });

    let seed = 'battle1'
    let db = new Wdb(mgdb, seed);
    // db.reset()
    //   () => { resolve(); }
    // );
  }

}
