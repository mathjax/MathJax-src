import {MathJax} from "mathjax3/mathjax.js";
export {MathJax} from "mathjax3/mathjax.js";

import "mathjax3/handlers/html.js";
import {AsciiMath} from "mathjax3/input/asciimath.js";
import {CHTML} from "mathjax3/output/chtml.js";

let OPTIONS = {
  InputJax: new AsciiMath(),
  OutputJax: new CHTML()
};

let HTML = [
  'This is some math: `x = y` and `x < z`.',
  '<div>',
  'text',
  '<!-- comment -->',
  '<p>',
  '`(x+1)/(x-1)`',
  'and',
  '`int x dx`',
  '</p>',
  '` x<br> y `',
  '<span>and more `z-1`</span>',
  '</div>'
].join("\n");

var html;
try {
  //
  //  Use browser document, if there is one
  //
  html = MathJax.HandlerFor(document,OPTIONS);
  document.body.insertBefore(document.createElement("hr"),document.body.firstChild);
  var div = document.createElement('div');
  div.innerHTML = HTML; div.style.marginBottom = "1em";
  document.body.insertBefore(div,document.body.firstChild);
} catch (err) {
  //
  //  Otherwise, make a new document (measurements not supported here)
  //
  html = MathJax.Document(
    '<html><head><title>Test MathJax3</title></head><body>'
    + HTML +
    '</body></html>',
    OPTIONS
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
