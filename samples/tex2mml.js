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
import '../mathjax3/input/tex/extpfeil/ExtpfeilConfiguration.js';
import '../mathjax3/input/tex/action/ActionConfiguration.js';
import '../mathjax3/input/tex/bbox/BboxConfiguration.js';
import '../mathjax3/input/tex/braket/BraketConfiguration.js';
import '../mathjax3/input/tex/physics/PhysicsConfiguration.js';

RegisterHTMLHandler(chooseAdaptor());

let html = MathJax.document('<html></html>', {
  InputJax: new TeX({packages: ['base', 'ams', 'boldsymbol', 'newcommand', 'extpfeil', 'braket', 'physics', 'action', 'bbox']})
});

import {SerializedMmlVisitor as MmlVisitor} from '../mathjax3/core/MmlTree/SerializedMmlVisitor.js';
let visitor = new MmlVisitor();
let toMml = (node => visitor.visitTree(node, html.document));

MathJax.handleRetriesFor(() => {

    let math = html.convert(process.argv[3] || '', {end: STATE.CONVERT});
    math.setTeXclass();
    console.log(toMml(math));

}).catch(err => console.log(err.stack));
