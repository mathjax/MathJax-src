import {mathjax} from '../mathjax3/mathjax.js';

import {TeX} from '../mathjax3/input/tex.js';
import {CHTML} from '../mathjax3/output/chtml.js';
import {adaptor, htmlDocument} from './lib/chooseHTML.js';

const OPTIONS = {
  InputJax: new TeX(),
  OutputJax: new CHTML()
};

const HTML = `
  <p id='p1' class='math'>
  This is \\$ some math: \\(x+1\\).
  </p>
  <p id='p2'>
  \\[x+1\\over x-1\\]
  and more
  \\(\\sin(x^2)\\)
  </p>
`;

const html = htmlDocument(HTML, OPTIONS);

mathjax.handleRetriesFor(() => {

    html.findMath({elements: ['#p1']})
        .compile()
        .getMetrics()
        .typeset()
        .updateDocument()
        .reset();
        
    console.log(adaptor.outerHTML(adaptor.parent(adaptor.body(html.document))));

}).catch(err => console.log(err.stack));
