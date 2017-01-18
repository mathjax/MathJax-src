import {MathJax} from "mathjax/mathjax.js";
export {MathJax} from "mathjax/mathjax.js";

import "mathjax/handlers/html.js";

var html;
try {
  //
  //  Use browser document, if there is one
  //
  html = MathJax.HandlerFor(document);
  var text = document.createTextNode('This is some math: \\(x+1\\).\n\\[x+1\\over x-1\\]');
  document.body.insertBefore(text,document.body.firstChild);
} catch (err) {
  //
  //  Otherwise, make a new document (measurements not supported here)
  //
  html = MathJax.HandlerFor(`
    <html>
    <head><title>Test MathJax3</title></head>
    <body>
    This is some math: \\(x+1\\).
    \\[x+1\\over x-1\\]
    </body></html>`
  );
}

MathJax.HandleRetriesFor(function () {

    html.FindMath()
        .Compile()
        .GetMetrics()
        .Typeset()
        .UpdateDocument();
        
    console.log(html.document.body.parentNode.outerHTML);

}).catch(err => {
  console.log(err.message);
  console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/,""));
});
