import {MathJax} from "mathjax/mathjax.js";
export {MathJax} from "mathjax/mathjax.js";

import "mathjax/handlers/html.js";

let html = MathJax.HandlerFor("<html></html>");

MathJax.HandleRetriesFor(function () {

    html.TestMath("\\require{color}\\color{red}x").Compile();
    console.log(JSON.stringify(html.typeset[0]));

}).catch(err => {console.log(err)});
