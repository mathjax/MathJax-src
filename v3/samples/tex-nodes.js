import {MathJax} from "mathjax3/mathjax.js";
export {MathJax} from "mathjax3/mathjax.js";

import "mathjax3/handlers/html.js";
import {TeX} from "mathjax3/input/tex.js";

let html = MathJax.Document("<html></html>",{
  InputJax: new TeX()
});

import {TestMmlVisitor} from 'mathjax3/core/MmlTree/TestMmlVisitor.js';
let visitor = new TestMmlVisitor();
let toMathML = function (node) {return visitor.visitTree(node,html.document)};

MathJax.HandleRetriesFor(function () {

    html.TestMath(process.argv[3] || '').Compile();
    let math = html.math.pop().root;
    math.setTeXclass();
    console.log(toMathML(math));

}).catch(err => {
  console.log(err.message);
  console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/,""));
});
