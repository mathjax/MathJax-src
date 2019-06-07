import {mathjax} from '../mathjax3/mathjax.js';

import {TeX} from '../mathjax3/input/tex.js';
import {htmlDocument} from './lib/chooseHTML.js';
import {printFound} from './lib/found.js';

const OPTIONS = {
    InputJax: new TeX()
};

const HTML = `
  This is some math: \\(x+1\\).
  <p>\\[x+1\\over x-1\\]</p>
  more: \\(1-x\\)
`;

const html = htmlDocument(HTML, OPTIONS);

mathjax.handleRetriesFor(() => {

    html.findMath();
    printFound(html);

}).catch(err => console.log(err.stack));
