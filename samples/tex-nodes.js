import {mathjax} from '../mathjax3/mathjax.js';

import {TeX} from '../mathjax3/input/tex.js';
import {RegisterHTMLHandler} from '../mathjax3/handlers/html.js';
import {chooseAdaptor} from '../mathjax3/adaptors/chooseAdaptor.js';

RegisterHTMLHandler(chooseAdaptor());

let html = mathjax.document('<html></html>',{
  InputJax: new TeX()
});

import {TestMmlVisitor} from '../mathjax3/core/MmlTree/TestMmlVisitor.js';
let visitor = new TestMmlVisitor();
let toMathML = (node => visitor.visitTree(node, html.document));

mathjax.handleRetriesFor(() => {

    html.TestMath(process.argv[3] || '').compile();
    let math = html.math.pop().root;
    math.setTeXclass();
    console.log(toMathML(math));

}).catch(err => console.log(err.stack));
