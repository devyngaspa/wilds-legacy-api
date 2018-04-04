module.exports = {

  hash: (obj) => {
    return new Promise( (resolve, reject) => {
      let keys     = Object.keys(obj);
      let promises = new Array();
      let indicies = {};
      keys.forEach( (key) => {
        let value = obj[key];
        if (Array.isArray(value)) {
          indicies[key]       = {};
          indicies[key].begin = promises.length;
          promises            = promises.concat(value);
          indicidies[key].end = promises.length - 1;
        }
        else {
          promises.push(value);
          indicies[key] = {begin: (promises.length - 1), end: promises.length};
        }
      })

      Promise.all(promises).then( (results) => {
        let hash = {};
        keys.forEach( (key) => {
          begin     = indicies[key].begin;
          end       = indicies[key].end;
          hash[key] = results.slice(begin, end);
          if (hash[key].length === 1) { hash[key] = hash[key][0]; }
        })
        resolve(hash);
      })
    });
  },

  all_with_order: (array, callback=null, ...callback_args) => {
    return new Promise( (resolve, reject) => {
      if (array.length === 0) { resolve([]) }
      else if (array.length === 1) { 
        array[0]().then( (result) => {
          if (callback) { callback(result, ...callback_args); }
          resolve([result]);
        });
      }
      else {
        array[0]().then( (result) => {
          if (callback) { callback(result, ...callback_args); }
          whelp.promise.all_with_order(array.slice(1, array.length), callback, ...callback_args).then( (results) => {
            resolve([result].concat(results));
          });
        });
      }
    });
  }

}
