import {MathJax} from "mathjax3/mathjax.js";
export {MathJax} from "mathjax3/mathjax.js";

import "mathjax3/handlers/html.js";
import {TeX} from "mathjax3/input/tex.js";

let html = MathJax.Document("<html></html>",{
  InputJax: new TeX()
});

import {JsonMmlVisitor} from 'mathjax3/core/MmlTree/JsonMmlVisitor.js';
let visitor = new JsonMmlVisitor();
let toJSON = function (node) {return visitor.visitTree(node)};

MathJax.HandleRetriesFor(function () {

    html.TestMath(process.argv[3] || '').Compile();
    let math = html.math.pop().root;
    math.setTeXclass();
    console.log(JSON.stringify(toJSON(math)));

}).catch(err => {
  console.log(err.message);
  console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/,""));
});
