import {MathJax} from "mathjax/mathjax.js";
export {MathJax} from "mathjax/mathjax.js";

import "mathjax/handlers/html.js";
import "mathjax/input/LegacyTeX.js";

let html = MathJax.HandlerFor("<html></html>");
MathJax.HandleRetriesFor(function () {

    html.TestMath(process.argv[3] || '').Compile();
    console.log(JSON.stringify(html.typeset[0]));

}).catch(err => {
  console.log(err.message);
  console.log(err.stack.replace(/\n    .*\/system.js:(.|\n)*/,""));
});

