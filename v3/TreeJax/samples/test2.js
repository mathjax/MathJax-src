require.cache = {};
var location = '/home/sorge/git/MathJax/mathjax-tc/v3/TreeJax/';
var tj = require(location + 'lib/index.js');
var sv = new tj.SemanticVisitor();
var mv = new tj.MathmlVisitor();
var json = {
  'children': [
    {
      'text': 'x',
      'type': 'mi',
      'attributes': {}
    },
    {
      'text': '2',
      'attributes': {},
      'type': 'mn'
    }
  ],
  'type': 'msup',
  'attributes': {}
};
//var tree = tj.parse(json);
// var tree = tj.parseFile(location + 'samples/fraction2.json');
//var tree = tj.parseFile(location + 'samples/superscript.json');
//var tree = tj.parseFile(location + 'samples/sum.json');
// var tree = tj.parseFile(location + 'samples/semantics.json');
// var tree = tj.parseFile(location + 'samples/sqrt.json');
var tree = tj.parseFile(location + 'samples/faa_di_bruno.json');
tree.accept(sv);
tree.accept(mv);
var sem = require('semantic');
sv.getResult().toString();
sem.getTree(mv.getResult()).toString();

