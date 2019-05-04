import {MathJax} from '../mathjax3/mathjax.js';

import {TeX} from '../mathjax3/input/tex.js';
import {RegisterHTMLHandler} from '../mathjax3/handlers/html.js';
import {chooseAdaptor} from '../mathjax3/adaptors/chooseAdaptor.js';
import {STATE} from '../mathjax3/core/MathItem.js';
import '../mathjax3/input/tex/base/BaseConfiguration.js';
import '../mathjax3/input/tex/ams/AmsConfiguration.js';
import '../mathjax3/input/tex/noundefined/NoUndefinedConfiguration.js';
import '../mathjax3/input/tex/boldsymbol/BoldsymbolConfiguration.js';
import '../mathjax3/input/tex/newcommand/NewcommandConfiguration.js';
import '../mathjax3/input/tex/mhchem/MhchemConfiguration.js';
import '../mathjax3/input/tex/braket/BraketConfiguration.js';

RegisterHTMLHandler(chooseAdaptor());

let html = MathJax.document('<html></html>', {
  InputJax: new TeX({packages: ['base', 'ams', 'boldsymbol', 'newcommand', 'mhchem', 'braket']})
});

import {JsonMmlVisitor} from '../mathjax3/core/MmlTree/JsonMmlVisitor.js';
let visitor = new JsonMmlVisitor();
let toJSON = (node => visitor.visitTree(node));

MathJax.handleRetriesFor(() => {

    let math = html.convert(process.argv[3] || '', {end: STATE.CONVERT});
    math.setTeXclass();
    console.log(JSON.stringify(toJSON(math)));

}).catch(err => console.log(err.stack));
