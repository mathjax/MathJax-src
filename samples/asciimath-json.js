import {MathJax} from '../mathjax3/mathjax.js';

import {AsciiMath} from '../mathjax3/input/asciimath.js';
import {RegisterHTMLHandler} from '../mathjax3/handlers/html.js';
import {chooseAdaptor} from '../mathjax3/adaptors/chooseAdaptor.js';

RegisterHTMLHandler(chooseAdaptor());

const html = MathJax.document('<html></html>', {
  InputJax: new AsciiMath()
});

import {JsonMmlVisitor} from '../mathjax3/core/MmlTree/JsonMmlVisitor.js';
const visitor = new JsonMmlVisitor();
const toJSON = (node => visitor.visitTree(node));

MathJax.handleRetriesFor(() => {

    html.TestMath(process.argv[3] || '').compile();
    let math = html.math.pop().root;
    math.setTeXclass();
    console.log(JSON.stringify(toJSON(math)));

}).catch(err => console.log(err.stack));
