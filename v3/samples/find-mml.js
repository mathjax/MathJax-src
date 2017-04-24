import {MathJax} from "mathjax3/mathjax.js";
export {MathJax} from "mathjax3/mathjax.js";

import "mathjax3/handlers/html.js";
import {MathML} from "mathjax3/input/mathml.js";

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
  html = MathJax.Document(document,OPTIONS);
  document.documentElement.setAttribute("xmlns:m","http://www.w3.org/1998/Math/MathML");
  document.body.insertBefore(document.createElement("hr"),document.body.firstChild);
  var div = document.createElement('div');
  div.innerHTML = HTML; div.style.marginBottom = "1em";
  document.body.insertBefore(div,document.body.firstChild);
} catch (err) {
  //
  //  Otherwise, make a new document (measurements not supported here)
  //
  html = MathJax.Document(
    '<html xmlns:m="http://www.w3.org/1998/Math/MathML">'
    + '<head><title>Test MathJax3</title></head><body>'
    + HTML +
    '</body></html>',
    OPTIONS
  );
}

MathJax.HandleRetriesFor(function () {

    html.FindMath();
    for (const math of html.math) {
      console.log(math.math,math.display);
      console.log("");
    };

}).catch(err => {
  console.log(err.message);
  console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/,""));
});
