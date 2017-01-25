import {MathJax} from "mathjax/mathjax.js";
export {MathJax} from "mathjax/mathjax.js";

import "mathjax/handlers/html.js";
import {TeX} from "mathjax/input/tex.js";

let OPTIONS = {
  InputJax: new TeX()
};

let HTML = `
  This is some math: $x = y \\text{ for $x < 1$}\\$$ and \\(x < y\\).
  <div>
  text
  <!-- comment -->
  <p>
  \\[x+1\\over x-1\\]
  and
  $$\int x\,dx$$
  </p>
    \\begin{xyz} x<br> y\\end{xyz}
  <span>and more \\$ and \\ref{x}</span>
  </div>
`;

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
  html = MathJax.HandlerFor(
    '<html><head><title>Test MathJax3</title></head><body>'
    + HTML +
    '</body></html>',
    OPTIONS
  );
}

const STRING = function (item) {
  let {node, n, delim} = item;
  let value = node.nodeValue;
  return (value.substr(0,n)+"|"+value.substr(n)).replace(/\n/g,"\\n");
}

MathJax.HandleRetriesFor(function () {

    html.FindMath();
    html.math.forEach(math => {
      console.log(math.math,math.display);
      console.log(">> ",STRING(math.start));
      console.log("<< ",STRING(math.end));
    });

}).catch(err => {
  console.log(err.message);
  console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/,""));
});
