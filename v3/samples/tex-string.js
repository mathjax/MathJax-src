import {MathJax} from "mathjax/mathjax.js";
export {MathJax} from "mathjax/mathjax.js";

import "mathjax/handlers/html.js";
import {TeX} from "mathjax/input/tex.js";

let html = MathJax.HandlerFor("<html></html>",{
  InputJax: new TeX()
});

import {JsonMmlVisitor} from 'MmlTree/js/JsonMmlVisitor.js';
let visitor = new JsonMmlVisitor();
let toJSON = function (node) {return visitor.visitTree(node)};

MathJax.HandleRetriesFor(function () {

    html.TestMath(process.argv[3] || '')
        .Compile();

    let math = html.math.pop().tree.getRoot();
    console.log(math.toString());

}).catch(err => {
  console.log(err.message);
  console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/,""));
});
