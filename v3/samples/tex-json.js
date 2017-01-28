import {MathJax} from "mathjax/mathjax.js";
export {MathJax} from "mathjax/mathjax.js";

import "mathjax/handlers/html.js";
import {LegacyTeX} from "mathjax/input/legacy/TeX.js";
let Translate = LegacyTeX.Translate;

let html = MathJax.HandlerFor("<html></html>");

MathJax.HandleRetriesFor(function () {

    html.TestMath(process.argv[3] || '');
    let math = html.math.pop();
    console.log(JSON.stringify(Translate(math.math,math.display)));

}).catch(err => {
  console.log(err.message);
  console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/,""));
});
