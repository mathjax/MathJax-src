import {MathJax} from "mathjax/mathjax.js";
import "mathjax/handlers/html.js";

function Delay(n) {
  return new Promise((ok,fail) => {setTimeout(ok,n)});
}

let html = MathJax.HandlerFor("<html></html>");

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
