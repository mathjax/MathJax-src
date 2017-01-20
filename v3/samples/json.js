import {MathJax} from "mathjax/mathjax.js";
export {MathJax} from "mathjax/mathjax.js";

import "mathjax/handlers/html.js";
import {LegacyTeX} from "mathjax/input/legacy/TeX.js";
let Translate = LegacyTeX.Translate;

let html = MathJax.HandlerFor("<html></html>");

MathJax.HandleRetriesFor(function () {

    html.TestMath(process.argv[3] || '');
    console.log(JSON.stringify(Translate(html.math[0].math,html.math[0].display)));

}).catch(err => {
  console.log(err.message);
  console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/,""));
});
