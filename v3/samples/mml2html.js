import {MathJax} from "mathjax/mathjax.js";
export {MathJax} from "mathjax/mathjax.js";

import "mathjax/handlers/html.js";
import {MathML} from "mathjax/input/mathml.js";
import {CHTML} from "mathjax/output/chtml.js";

let html = MathJax.HandlerFor("<html></html>", {
  InputJax: new MathML(),
  OutputJax: new CHTML()
});

MathJax.HandleRetriesFor(function () {

    html.TestMath(process.argv[3] || '<math></math>').Compile().Typeset();
    let math = html.math.pop();
    console.log(math.typeset.outerHTML);

}).catch(err => {
  console.log(err.message);
  console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/,""));
});
