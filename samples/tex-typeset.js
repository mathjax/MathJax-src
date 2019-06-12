import {mathjax} from '../mathjax3/mathjax.js';

import {TeX} from '../mathjax3/input/tex.js';
import {CHTML} from '../mathjax3/output/chtml.js';
import {htmlDocument} from './lib/chooseHTML.js';

const OPTIONS = {
  InputJax: new TeX(),
  OutputJax: new CHTML()
};

const HTML = `
  This is \\$ some math: \\(x+1\\).
  \\[x+1\\over x-1\\]
`;

const html = htmlDocument(HTML, OPTIONS);

mathjax.handleRetriesFor(() => {

    html.findMath()
        .compile()
        .typeset();
        
    console.log(Array.from(html.math));

}).catch(err => console.log(err.stack));
