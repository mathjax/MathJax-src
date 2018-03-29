import {MathJax} from "mathjax3/mathjax.js";

import {MathML} from "mathjax3/input/mathml.js";
import {RegisterHTMLHandler} from "mathjax3/handlers/html.js";
import {chooseAdaptor} from "mathjax3/adaptors/chooseAdaptor.js";

RegisterHTMLHandler(chooseAdaptor());

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
  html = MathJax.document(document,OPTIONS);
  document.documentElement.setAttribute("xmlns:m","http://www.w3.org/1998/Math/MathML");
  document.body.insertBefore(document.createElement("hr"),document.body.firstChild);
  var div = document.createElement('div');
  div.innerHTML = HTML; div.style.marginBottom = "1em";
  document.body.insertBefore(div,document.body.firstChild);
} catch (err) {
  //
  //  Otherwise, make a new document (measurements not supported here)
  //
  html = MathJax.document(
    '<html xmlns:m="http://www.w3.org/1998/Math/MathML">'
    + '<head><title>Test MathJax3</title></head><body>'
    + HTML +
    '</body></html>',
    OPTIONS
  );
}

html.adaptor.document = html.document;

MathJax.handleRetriesFor(function () {

    html.findMath();
    for (const math of html.math) {
      console.log(math.math,math.display);
      console.log("");
    };

}).catch(err => {
  console.log(err.message);
  console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/,""));
});
