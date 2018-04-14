
const mj = require('../../mathjax3/mathjax.js');
const tex = require('../../mathjax3/input/tex.js');
const texold = require('../../mathjax2/input/TeX.js');
texold.LegacyTeX.Translate('x^2') // => MmlNode
require('../../mathjax3/handlers/html.js');

let html = mj.MathJax.document('<html></html>', {
  InputJax: new tex.TeX()
});

// Example computation.
html.TestMath('x^2');
var math = html.math.pop();  // => MathItem.

// Reset example.
html.processed.TextMath = false;

// Running a visitor.
const mmlVisitor = require('../../mathjax3/core/MmlTree/MmlVisitor.js');
var mmv = new mmlVisitor.MmlVisitor();
const jmmlVisitor = require('../../mathjax3/core/MmlTree/JsonMmlVisitor.js');
mmv = new jmmlVisitor.JsonMmlVisitor();
var node = texold.LegacyTeX.Translate('x^2');
mmv.visitTree(node);
