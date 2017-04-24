import {MathJax} from "mathjax3/mathjax.js";
export {MathJax} from "mathjax3/mathjax.js";

import "mathjax3/handlers/html.js";
import {TeX} from "mathjax3/input/tex.js";
import {APPEND} from "mathjax3/util/Options.js";

let OPTIONS = {
  InputJax: new TeX({inlineMath:{[APPEND]:[['$','$']]}})
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
    \\begin{equation} x<br> y\\end{equation}
  <span>and more \\$ and \\ref{x}</span>
  </div>
`;

var html;
try {
  //
  //  Use browser document, if there is one
  //
  html = MathJax.Document(document,OPTIONS);
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

const STRING = function (item) {
  let {node, n, delim} = item;
  let value = node.nodeValue;
  return (value.substr(0,n)+"@"+value.substr(n)).replace(/\n/g,"\\n");
};

MathJax.HandleRetriesFor(function () {

    html.FindMath();
    for (const math of html.math) {
      console.log(math.math,math.display);
      console.log(">> ",STRING(math.start));
      console.log("<< ",STRING(math.end));
    };

}).catch(err => {
  console.log(err.message);
  console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/,""));
});
