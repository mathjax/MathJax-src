import {MathJax} from "mathjax3/mathjax.js";
import "mathjax3/handlers/html.js";

function Delay(n) {
  return new Promise((ok,fail) => {setTimeout(ok,n)});
}

let html = MathJax.Document("<html></html>");

MathJax.HandleRetriesFor(function () {

  html.FindMath()
      .Compile()
      .GetMetrics()
      .Typeset()
      .AddEventHandlers()
      .UpdateDocument();

}).then(_ => {console.log("Worked!")})
  .catch(err => {
    console.log(err.message);
    console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/,""));
  });
