let test = require('tape');

let Options = require("../../../../mathjax3/util/Options.js");
let APPEND = Options.APPEND;

/****************************************************************************/

test("Options", t => {

  //
  // Check keys()
  //
  let keys = Options.keys({a: 1, [Symbol.iterator]: 2});
  t.deepEqual(keys,['a',Symbol.iterator], "keys() gets keys and symbols");
  t.deepEqual(Options.keys(null),[], "keys() works on null list");
  t.deepEqual(Options.keys({}),[], "keys() works on empty list");
  
  //
  // Check copy()
  //
  let orig = {
    a: 1,
    b: {x: 'x'},
    c: {y: 'y'},
    d: [1, {z: 'z'}, {w: 'w'}],
    e: [1],
    [Symbol.iterator]: 1
  };
  let copy = Options.copy(orig);
  t.deepEqual(copy, orig, "copy() copies properly");
  orig.a = 2; orig.b.x = 'xx'; orig.c = {yy: 'yy'};
  orig.d[0] = 2; orig.d[1].z = 'zz'; orig.d[2] = {ww: 'ww'};
  orig.e = [2]; orig.f = 2; orig[Symbol.iterator] = 2;
  t.deepEqual(copy, {
    a: 1,
    b: {x: 'x'},
    c: {y: 'y'},
    d: [1, {z: 'z'}, {w: 'w'}],
    e: [1],
    [Symbol.iterator]: 1
  }, "Changing original doesn't change copy");
  t.equal(copy[Symbol.iterator],1, "copy() copies symbols");
  copy = Options.copy({
    _a: 1,
    get a() {return this._a},
    set a(x) {this._a = x}
    
  });
  t.equal(copy.a,1, "copy() copies getter");
  copy.a = 2;
  t.equal(copy.a,2, "copy() copies setter");
  copy = Options.copy({},{});
  t.deepEqual(copy, {}, "copy() handles empty objects");
  
  //
  //  Check Insert
  //
  let options = {a: 1, b: {x: 'x', y: [0]}, c: [1,2,3]};
  copy = Options.insert({},options,false);
  t.deepEqual(copy,options, "insert() copies properly");

  try {
    copy = Options.insert({},options);
    t.fail("insert() doens't error for unknown key");
  } catch(e) {
    t.pass("insert() errors on unknown key");
  }
  try {
    copy = Options.insert({a: 2, b: {}, c: [4]}, options, true);
    t.fail("insert() doens't error for unknown nested key");
  } catch(e) {
    t.pass("insert() errors on unknown nested key");
  }

  copy = Options.insert({a: 2, b: {}, c: [4]}, options, false);
  t.deepEqual(copy, options, "insert() adds to objects and replaces other values");
  
  copy = Options.insert({a: {}, b: 2}, {a: {x: 'x'}}, false);
  t.deepEqual(copy, {a: {x: 'x'}, b: 2}, "insert() merges objects");
  
  copy = Options.insert({a: function () {}}, {a: {x: 'x'}}, false);
  t.deepEqual(copy.a.x, 'x', "insert() merges into functions");
  
  copy = Options.insert({a: {x: 'x'}}, {a: 1}, false);
  t.deepEqual(copy, {a: 1}, "insert() changes object type");

  copy = Options.insert({a: [1,2]}, {a: [3,4]}, false);
  t.deepEqual(copy, {a: [3,4]}, "insert() replaces arrays");

  copy = Options.insert({a: [1,2]}, {a: {[APPEND]:[3,4]}}, false);
  t.deepEqual(copy, {a: [1,2,3,4]}, "insert() appends to arrays with APPEND key");
  
  copy = Options.insert({a: 1}, {});
  t.deepEqual(copy, {a: 1}, "insert() handles empty object");
  
  //
  // Check defaultOptions()
  //
  copy = {};
  try {
    copy = Options.defaultOptions({}, {a: 1}, {b: 2});
    t.pass("defaultOptions() doesn't fail for unknown keys");
  } catch(e) {
    t.fail("defaultOptions() fails for unknown keys: "+e.message);
  }
  t.deepEqual(copy,{a: 1, b: 2}, "defaultOptions() merges multiple objects");

  //
  // Check userOptions()
  //
  copy = {};
  try {
    copy = Options.userOptions({}, {a: 1}, {b: 2});
    t.fail("userOptions() doesn't fail for unknown keys");
  } catch(e) {
    t.pass("userOptions() fails for unknown keys");
  }
  copy = {};
  try {
    copy = Options.userOptions({a: 'x'}, {a: 1}, {b: 2});
    t.fail("userOptions() doesn't fail for unknown keys");
  } catch(e) {
    t.pass("userOptions() fails for unknown secondary keys");
  }
  copy = Options.userOptions({a: 'x', b: 'y'}, {a: 1}, {b: 2});
  t.deepEqual(copy, {a: 1, b: 2}, "userOptions() merges multiple options");

  //
  // Check selectOptions()
  //
  options = {a: 1, b: 2, c: 3, d: 4};
  copy = Options.selectOptions(options, 'a', 'c', 'x', 'y');
  t.deepEqual(copy, {a: 1, c: 3}, "selectOptions() finds existing keys and skips others");
  copy = Options.selectOptions({}, 'x', 'y');
  t.deepEqual(copy, {}, "selectOptions() handles empty list");
  copy = Options.selectOptions(options);
  t.deepEqual(copy, {}, "selectOptions() handles emtpy list of keys");

  //
  // Check selectOptionsFromKeys()
  //
  options = {a: 1, b: 2, c: 3, d: 4};
  copy = Options.selectOptionsFromKeys(options, {a: true, c: true, x: true, y: true});
  t.deepEqual(copy, {a: 1, c: 3}, "selectOptionsFromKeys() finds existing keys and skips others");
  copy = Options.selectOptions({}, options);
  t.deepEqual(copy, {}, "selectOptionsFromKeys() handles empty source list");
  copy = Options.selectOptions(options, {});
  t.deepEqual(copy, {}, "selectOptionsFromKeys() handles empty key list");
  
  //
  // Check separateOptions()
  //
  options = {a: 1, b: 2, c: 3, d: 4, e: 5};
  let result = Options.separateOptions(options, {a: true, c: true});
  t.deepEqual(result, [{b: 2, d: 4, e: 5}, {a: 1, c: 3}], "separateOptions() works with one set");
  result = Options.separateOptions(options, {a: true, c: true}, {d: true});
  t.deepEqual(result, [{b: 2, e: 5}, {a: 1, c: 3}, {d: 4}], "separateOptions() works with two sets");
  result = Options.separateOptions(options);
  t.deepEqual(result, [options], "separateOptions() works with no sets");
  result = Options.separateOptions(options, {a: true, c: true, x: true});
  t.deepEqual(result, [{b: 2, d:4, e: 5}, {a: 1, c: 3}], "separateOptions() works with unknown keys");

  t.end();

});
