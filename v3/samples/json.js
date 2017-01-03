import {MathJax} from "mathjax/mathjax.js";
export {MathJax} from "mathjax/mathjax.js";

import "mathjax/handlers/html.js";
import "mathjax/input/LegacyTeX.js";

let html = MathJax.HandlerFor("<html></html>");
html.TestMath(process.argv[3] || "x").Compile();
console.log(JSON.stringify(html.typeset[0]));
