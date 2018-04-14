import {MathJax} from "mathjax3/mathjax.js";

import {RegisterHTMLHandler} from "mathjax3/handlers/html.js";
import {chooseAdaptor} from "mathjax3/adaptors/chooseAdaptor.js";

RegisterHTMLHandler(chooseAdaptor());

let html = MathJax.document("<html></html>");

MathJax.handleRetriesFor(function () {

  html.findMath()
      .compile()
      .getMetrics()
      .typeset()
      .addEventHandlers()
      .updateDocument();

}).then(_ => {console.log("Worked!")})
  .catch(err => {
    console.log(err.message);
    console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/,""));
  });
