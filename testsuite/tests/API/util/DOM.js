let test = require('tape');
let SpawnJsonTest = require('../../../lib/SpawnTest.js').SpawnJsonTest;

let DOM = require("../../../../mathjax3/util/DOM.js").DOM;

/****************************************************************************/

function CheckJson(json) {
  for (const name of Object.keys(json)) {
    if (!json[name]) return name;
    if (json[name] instanceof Object) {
      let result = CheckJson(json[name]);
      if (result !== true) return name+"."+result;
    }
    if (name === 'DOMParserResult' && json[name] !== '<html><head></head><body></body></html>') {
      return name;
    }
  }
  return true;
}

/****************************************************************************/

test("DOM utility", t => {
  
  let output;
  
  output = SpawnJsonTest([__dirname, 'DOM.child']);
  t.equal(!output.browser && !output.system, true, "Node version used");
  t.equal(CheckJson(output), true, ". Objects OK");
  
  output = SpawnJsonTest([__dirname, 'DOM.child'], ['system']);
  t.equal(!output.browser && output.system, true, "System version used");
  t.equal(CheckJson(output), true, ". Objects OK");
  
  output = SpawnJsonTest([__dirname, 'DOM.child'], ['browser']);
  t.equal(output.browser && !output.system, true, "Browser version used");
  t.equal(CheckJson(output), true, ". Objects OK");
  
  t.end();
  
});
