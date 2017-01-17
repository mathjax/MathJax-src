import {MathJax} from "mathjax/mathjax.js";
export {MathJax} from "mathjax/mathjax.js";

import "mathjax/handlers/html.js";

let html = MathJax.HandlerFor(`
<html>
<head><title>Test MathJax3</title></head>
<body>
This is some math: \\(x+1\\).
\\[x+1\\over x-1\\]
</body>
</html>
`);

MathJax.HandleRetriesFor(function () {

    html.FindMath()
        .Compile()
        .Typeset();
        
    console.log(html.math);

}).catch(err => {
  console.log(err.message);
  console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/,""));
});
