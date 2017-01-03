require.cache = {};
var path = require("path");
var location = path.resolve(__dirname,'../') + '/';
var tj = require(location + 'lib/index.js');
var sem = require('semantic');
var assert = require('assert');

var tests = [
  'fraction2',
  'fraction',
  'pure_superscript',
  'root',
  'semantics',
  'sqrt',
  'sum',
  'superscript',
  'faa_di_bruno'
  //'faa_di_bruno_simple'
];



var testRunner = function() {
  var timeIn = (new Date()).getTime();
  for (var test of tests) {
    console.log('Testing ' + test + '...');
    var tree = getSample(test);
    var sv = new tj.SemanticVisitor();
    var mv = new tj.MathmlVisitor();
    tree.accept(sv);
    tree.accept(mv);
    var mvStr = removeIds(sem.getTreeFromString(
      rewriteMathmlString(mv.getResult().toString())).toString());
    var svStr = removeIds(sv.getResult().toString());
    assert.equal(mvStr, svStr);
  }
  var timeOut = (new Date()).getTime();
  console.log('Time: ' + (timeOut - timeIn));
};

var getSample = function(basename) {
  return tj.parseFile(location + 'samples/' + basename + '.json');
};

var rewriteMathmlString = function(str) {
  return str.replace(/#x/g, '&#x');
};

var removeIds = function(str) {
  return str.replace(/ id="\d*"/g, '');
};


testRunner();
