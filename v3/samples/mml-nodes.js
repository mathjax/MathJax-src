import {MathJax} from "mathjax3/mathjax.js";
export {MathJax} from "mathjax3/mathjax.js";

import "mathjax3/handlers/html.js";
import {MathML} from "mathjax3/input/mathml.js";

let html = MathJax.Document("<html></html>",{
  InputJax: new MathML()
});

import {TestMmlVisitor as MmlVisitor} from 'mathjax3/core/MmlTree/TestMmlVisitor.js';
//import {SerializedMmlVisitor as MmlVisitor} from 'mathjax3/core/MmlTree/SerializedMmlVisitor.js';
let visitor = new MmlVisitor();
let toMathML = function (node) {return visitor.visitTree(node,html.document)};

MathJax.HandleRetriesFor(function () {

    html.TestMath(process.argv[3] || '').Compile();
    let math = html.math.pop();
    console.log(toMathML(math.root));

}).catch(err => {
  console.log(err.message);
  console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/,""));
});
