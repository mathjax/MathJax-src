import {mathjax} from '../mathjax3/mathjax.js';

import {TeX} from '../mathjax3/input/tex.js';
import {CHTML} from '../mathjax3/output/chtml.js';
import {adaptor, htmlDocument} from './lib/chooseHTML.js';

const OPTIONS = {
  InputJax: new TeX(),
  OutputJax: new CHTML()
};

const HTML = process.argv[3] || `
  This is \\$ some math: \\(\\sin(x+1)\\) and \\(\\bf x \\scr X \\mathbb X \\sf X \\cal X \\frak X\\).
  \\[x+1\\over x-1\\]
`;

const html = htmlDocument(HTML, OPTIONS);

mathjax.handleRetriesFor(() => {

    html.findMath()
        .compile()
        .getMetrics()
        .typeset()
        .updateDocument();
        
    console.log(adaptor.outerHTML(adaptor.parent(adaptor.body(html.document))));

}).catch(err => console.log(err.stack));
