import {MathJax} from "mathjax/mathjax.js";
export {MathJax} from "mathjax/mathjax.js";

import "mathjax/handlers/html.js";
import {TeX} from "mathjax/input/tex.js";

let html = MathJax.HandlerFor("<html></html>",{
  InputJax: new TeX()
});

import {TestMmlVisitor} from 'MmlTree/js/TestMmlVisitor.js';
let visitor = new TestMmlVisitor();
let toMathML = function (node) {return visitor.visitTree(node,html.document)};

MathJax.HandleRetriesFor(function () {

    html.TestMath(process.argv[3] || '')
        .Compile();

    let math = html.math.pop();
    console.log(toMathML(math.tree.getRoot()));

}).catch(err => {
  console.log(err.message);
  console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/,""));
});
