let test = require('tape');
let resolve = require('path').resolve;
let PromiseTests = require('../../../lib/PromiseTests.js').PromiseTests;

let asyncLoad = require("../../../../mathjax3/util/AsyncLoad.js").asyncLoad;

/****************************************************************************/

test("asyncLoad()", t => {
  
  //
  //  The child file to load, and one tht doesn't exist
  //
  let file = resolve(__dirname, 'AsyncLoad.child');
  let unknown = resolve(__dirname, 'AsyncLoad.unknown');
  //
  //  Report errors in failed promises
  //
  let asyncError = ((err) => t.fail('asyncLoad() fails: '+err.message));

  PromiseTests(t,[
    //
    //  Test System.js loading of asynchronous file
    //
    [
      () => {
        System = require("../../../../lib/system.js");
        return asyncLoad(file);
      },
      (data) => {
        t.deepEquals(data,{loaded:true}, "asyncLoad() loads file through System.js");
      },
      asyncError
    ],
    //
    //  Test System.js error handling
    //
    [
      () => {
        return asyncLoad(unknown);
      },
      () => t.fail("asyncLoad() doesn't fail on non-existant files for System.js"),
      () => t.pass("asyncLoad() fails for non-existant files for System.js")
    ],
    //
    //  Test node.js loading of asynchronous file
    //
    [
      () => {
        System = undefined;
        return asyncLoad(file);
      },
      (data) => {
        t.deepEquals(data,{loaded:true}, "asyncLoad() loads file through node.js");
        data.node = true;
      },
      asyncError
    ],
    //
    //  Test node.js error handling
    //
    [
      () => {
        return asyncLoad(unknown);
      },
      () => t.fail("asyncLoad() doesn't fail on non-existant files for node.js"),
      () => t.pass("asyncLoad() fails for non-existant files for node.js")
    ]
    
  ]);

});
