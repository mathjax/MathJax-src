import {MathJax} from "mathjax3/mathjax.js";

import {MathML} from "mathjax3/input/mathml.js";
import {CHTML} from "mathjax3/output/chtml.js";
import {RegisterHTMLHandler} from "mathjax3/handlers/html.js";
import {chooseAdaptor} from "mathjax3/adaptors/chooseAdaptor.js";

RegisterHTMLHandler(chooseAdaptor());

let html = MathJax.document("<html></html>", {
  InputJax: new MathML(),
  OutputJax: new CHTML()
});

MathJax.handleRetriesFor(function () {

    html.TestMath(process.argv[3] || '<math></math>').compile().typeset();
    let math = html.math.pop();
    console.log(math.typesetRoot.outerHTML);

}).catch(err => {
  console.log(err.message);
  console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/,""));
});
