import {MathJax} from "mathjax3/mathjax.js";

import {AsciiMath} from "mathjax3/input/asciimath.js";
import {RegisterHTMLHandler} from "mathjax3/handlers/html.js";
import {chooseAdaptor} from "mathjax3/adaptors/chooseAdaptor.js";

RegisterHTMLHandler(chooseAdaptor());

let OPTIONS = {
  InputJax: new AsciiMath()
};

let HTML = [
  'This is some math: `x = y` and `x < z`.',
  '<div>',
  'text',
  '<!-- comment -->',
  '<p>',
  '`(x+1)/(x-1)`',
  'and',
  '`int x dx`',
  '</p>',
  '` x<br> y `',
  '<span>and more `z-1`</span>',
  '</div>'
].join("\n");

var html;
try {
  //
  //  Use browser document, if there is one
  //
  html = MathJax.document(document,OPTIONS);
  document.body.insertBefore(document.createElement("hr"),document.body.firstChild);
  var div = document.createElement('div');
  div.innerHTML = HTML; div.style.marginBottom = "1em";
  document.body.insertBefore(div,document.body.firstChild);
} catch (err) {
  //
  //  Otherwise, make a new document (measurements not supported here)
  //
  html = MathJax.document(
    '<html><head><title>Test MathJax3</title></head><body>'
    + HTML +
    '</body></html>',
    OPTIONS
  );
}

const STRING = function (item) {
  let {node, n, delim} = item;
  let value = node.nodeValue;
  return (value.substr(0,n)+"@"+value.substr(n)).replace(/\n/g,"\\n");
};

const DELIMITERS = function (start,end) {
  let value = start.node.nodeValue;
  let [n,m] = [start.n,end.n];
  return (value.substr(0,n)+"@"+value.substr(n,m-n)+"@"+value.substr(m)).replace(/\n/g,"\\n");
};

MathJax.handleRetriesFor(function () {

    html.findMath();
    for (const math of html.math) {
      console.log(math.math,math.display);
      if (math.start.node === math.end.node) {
        console.log("=> ",DELIMITERS(math.start,math.end));
      } else {
        console.log(">> ",STRING(math.start));
        console.log("<< ",STRING(math.end));
      }
    };

}).catch(err => {
  console.log(err.message);
  console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/,""));
});
