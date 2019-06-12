import {mathjax} from '../mathjax3/mathjax.js';

import {MathML} from '../mathjax3/input/mathml.js';
import {CHTML} from '../mathjax3/output/chtml.js';
import {RegisterHTMLHandler} from '../mathjax3/handlers/html.js';
import {chooseAdaptor} from '../mathjax3/adaptors/chooseAdaptor.js';

const adaptor = chooseAdaptor();
RegisterHTMLHandler(adaptor);

const html = mathjax.document('<html></html>', {
    InputJax: new MathML(),
    OutputJax: new CHTML()
});

function showBBox(node, space) {
    const {h, d, w} = node.getBBox();
    console.log(space + node.node.toString(), [h, d, w], node.variant);
    if (!node.node.isToken && !node.node.isKind('annotation') && !node.node.isKind('annotation-xml')) {
        for (const child of node.childNodes) showBBox(child, space+'  ');
    }
}

mathjax.handleRetriesFor(() => {

    html.TestMath(process.argv[3] || '<math></math>').compile().typeset();
    let math = html.math.pop();
    let chtml = html.options.OutputJax;
    chtml.document = html;
    chtml.math = math;
    chtml.nodeMap = new Map();
    let wrap = chtml.factory.wrap(math.root);

    console.log('');
    showBBox(wrap, '');
    console.log('');
    console.log(adaptor.outerHTML(math.typesetRoot));

}).catch(err => console.log(err.stack));
