import {MathJax} from "mathjax3/mathjax.js";
export {MathJax} from "mathjax3/mathjax.js";

import "mathjax3/handlers/html.js";
import {MathML} from "mathjax3/input/mathml.js";
import {CHTML} from "mathjax3/output/chtml.js";

let html = MathJax.Document("<html></html>", {
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
