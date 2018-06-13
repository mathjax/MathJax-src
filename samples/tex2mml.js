import {MathJax} from '../mathjax3/mathjax.js';

import {TeX} from '../mathjax3/input/tex.js';
import {RegisterHTMLHandler} from '../mathjax3/handlers/html.js';
import {chooseAdaptor} from '../mathjax3/adaptors/chooseAdaptor.js';
import '../mathjax3/input/tex/base/BaseConfiguration.js';
import '../mathjax3/input/tex/ams/AmsConfiguration.js';
import '../mathjax3/input/tex/noundefined/NoUndefinedConfiguration.js';
import '../mathjax3/input/tex/boldsymbol/BoldsymbolConfiguration.js';
import '../mathjax3/input/tex/newcommand/NewcommandConfiguration.js';

RegisterHTMLHandler(chooseAdaptor());

let html = MathJax.document('<html></html>', {
  InputJax: new TeX({packages: ['base', 'ams', 'boldsymbol', 'newcommand']})
});

// import {TestMmlVisitor as MmlVisitor} from '../mathjax3/core/MmlTree/TestMmlVisitor.js';
import {SerializedMmlVisitor as MmlVisitor} from '../mathjax3/core/MmlTree/SerializedMmlVisitor.js';
let visitor = new MmlVisitor();
let toMml = (node => visitor.visitTree(node, html.document));

MathJax.handleRetriesFor(() => {

    html.TestMath(process.argv[3] || '').compile();
    let math = html.math.pop().root;
    math.setTeXclass();
    console.log(toMml(math));

}).catch(err => console.log(err.stack));
