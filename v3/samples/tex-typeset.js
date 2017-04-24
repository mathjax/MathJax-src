import {MathJax} from "mathjax3/mathjax.js";
export {MathJax} from "mathjax3/mathjax.js";

import "mathjax3/handlers/html.js";
import {TeX} from "mathjax3/input/tex.js";
import {CHTML} from "mathjax3/output/chtml.js";

let OPTIONS = {
  InputJax: new TeX(),
  OutputJax: new CHTML()
};

let html = MathJax.Document(`
  <html>
  <head><title>Test MathJax3</title></head>
  <body>
  This is some math: \\(x+1\\).
  \\[x+1\\over x-1\\]
  </body></html>`,
  OPTIONS
);

MathJax.HandleRetriesFor(function () {

    html.FindMath()
        .Compile()
        .Typeset();
        
    console.log(Array.from(html.math));

}).catch(err => {
  console.log(err.message);
  console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/,""));
});
