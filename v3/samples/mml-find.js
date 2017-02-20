import {MathJax} from "mathjax/mathjax.js";
export {MathJax} from "mathjax/mathjax.js";

import "mathjax/handlers/html.js";
import {MathML} from "mathjax/input/MathML.js";

let OPTIONS = {
  InputJax: new MathML()
};

let HTML = `
  This is some math: <math><mi>x</mi></math>.
  <div>
  text
  <!-- comment -->
  <p>
  <m:math>
    <m:mi>y</m:mi>
  </m:math>
  end
  </p>
  <span>and more <math><mtext>here</mtext></math></span>
  </div>
`;

var html;
try {
  //
  //  Use browser document, if there is one
  //
  html = MathJax.HandlerFor(document,OPTIONS);
  document.documentElement.setAttribute("xmlns:m","http://www.w3.org/1998/Math/MathML");
  document.body.insertBefore(document.createElement("hr"),document.body.firstChild);
  var div = document.createElement('div');
  div.innerHTML = HTML; div.style.marginBottom = "1em";
  document.body.insertBefore(div,document.body.firstChild);
} catch (err) {
  //
  //  Otherwise, make a new document (measurements not supported here)
  //
  html = MathJax.HandlerFor(
    '<html xmlns:m="http://www.w3.org/1998/Math/MathML">'
    + '<head><title>Test MathJax3</title></head><body>'
    + HTML +
    '</body></html>',
    OPTIONS
  );
}

MathJax.HandleRetriesFor(function () {

    html.FindMath();
    console.log(Array.from(html.math));

}).catch(err => {
  console.log(err.message);
  console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/,""));
});
