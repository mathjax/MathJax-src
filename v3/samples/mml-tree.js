import {MathJax} from "mathjax/mathjax.js";
export {MathJax} from "mathjax/mathjax.js";

import "mathjax/handlers/html.js";
import {TeX} from "mathjax/input/tex.js";
import {MmlVisitor} from "TreeJax/lib/mml_visitor.js";

let mml = new MmlVisitor();
let html = MathJax.HandlerFor("<html></html>",{InputJax: new TeX()});

MathJax.HandleRetriesFor(function () {

    html.TestMath(process.argv[3] || '').Compile();
    mml.visitTree(html.math[0].tree);
    console.log(mml.getResult().toString());

}).catch(err => {
  console.log(err.message);
  console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/,""));
});
