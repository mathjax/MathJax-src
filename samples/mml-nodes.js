import {mathjax} from '../mathjax3/mathjax.js';

import {MathML} from '../mathjax3/input/mathml.js';
import {RegisterHTMLHandler} from '../mathjax3/handlers/html.js';
import {chooseAdaptor} from '../mathjax3/adaptors/chooseAdaptor.js';

RegisterHTMLHandler(chooseAdaptor());

let html = mathjax.document('<html></html>', {
  InputJax: new MathML()
});

import {TestMmlVisitor as MmlVisitor} from '../mathjax3/core/MmlTree/TestMmlVisitor.js';
//import {SerializedMmlVisitor as MmlVisitor} from '../mathjax3/core/MmlTree/SerializedMmlVisitor.js';
let visitor = new MmlVisitor();
let toMathML = (node => visitor.visitTree(node, html.document));

mathjax.handleRetriesFor(() => {

    html.TestMath(process.argv[3] || '').compile();
    let math = html.math.pop();
    console.log(toMathML(math.root));

}).catch(err => console.log(err.stack));
