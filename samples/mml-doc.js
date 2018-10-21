import {MathJax} from '../mathjax3/mathjax.js';
import {MathML} from '../mathjax3/input/mathml.js';

import {CHTML} from '../mathjax3/output/chtml.js';
//import {SVG} from '../mathjax3/output/svg.js';
import {RegisterHTMLHandler} from '../mathjax3/handlers/html.js';
import {browserAdaptor} from '../mathjax3/adaptors/browserAdaptor.js';

RegisterHTMLHandler(browserAdaptor());

const OPTIONS = {
  InputJax: new MathML(),
  OutputJax: new /*SVG() */CHTML()
};

const html = MathJax.document(document, OPTIONS);

MathJax.handleRetriesFor(() => {

    html.findMath()
        .compile()
        .getMetrics()
        .typeset()
        .updateDocument();
        
//    console.log(adaptor.outerHTML(adaptor.parent(adaptor.body(html.document))));

}).catch(err => console.log(err.stack));
