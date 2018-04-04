module.exports = {

  copy_obj_array: (array) => {
    if (!Array.isArray(array)) { return null; }
    new_array = new Array();
    array.forEach( (element, i) => {
      obj = Object.assign({}, element);
      new_array[i] = obj;
    });
    return new_array;
  },

  flatten: (arrays) => { return [].concat.apply([], arrays); },

  for_each: (array, callback) => {
    for(let i = 0; i < array.length; i++) {
      let element = array[i];
      callback(element);
    }
  },

  sort_by: (array, property) => {
    return array.sort( (a, b) => {
      if (a[property] > b[property]) { return -1; }
      else if (a[property] < b[property]) { return 1; }
      else { return 0; }
    });
  },

  filter_by: (array, property, value) => {
    return array.filter((element) => {
      if (value === undefined) { return element[property] }
      else { return element[property] === value }
    })
  },

  find_by: (array, property, value, invert=false) => {
    for(let i = 0; i < array.length; i++) {
      let element = array[i];
      if (value === undefined) {
        if (element[property]) { return element; }
      }
      else {
        if (invert) {
          if (element[property] !== value) { return element; }
        }
        else {
          
          if (element[property] === value) { return element; }
        }
      }
    };
    return null;
  },

  map_by: (array, property) => {
    return array.map( (element) => { return element[property]; });
  },

  group_by: (array, property) => {
    let obj = {};
    for(let i = 0; i < array.length; i++) {
      let value  = array[i][property];
      obj[value] = obj[value] || [];
      obj[value].push(array[i]);
    }
    return obj;
  },

  times: (n, callback) => {
    let array = Array(n);
    array.fill(undefined, 0);
    return array.map((e) => { return callback() })
  },

  compact: (array) => { return array.filter( (element) => { return (element != undefined && element != null); }); },

  sample: (array, n=1, singularize=true) => { 
    let l = array.length
    if (n > l) { throw "Sample: more elements taken than available" }
    let results = Array(n);
    let taken   = Array(n);

    while (n--) {
      let i      = Math.floor(Math.random() * l);
      results[n] = array[i in taken ? taken[i] : i];
      taken[i]   = --l in taken ? taken[l] : l;
    }

    return ((results.length === 1 && singularize) ? results[0] : results)
  }

}
