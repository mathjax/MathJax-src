import {mathjax} from '../mathjax3/mathjax.js';

import {TeX} from '../mathjax3/input/tex.js';
import {adaptor, htmlDocument} from './lib/chooseHTML.js';
import {printFound} from './lib/found.js';

const OPTIONS = {
  InputJax: new TeX()
};

const HTML = `
  This is some math: $x = y \\text{ for $x < 1$}\\$$ and \\(x < y\\).
  <div>
  text
  <!-- comment -->
  <p>
  \\[x+1\\over x-1\\]
  and
  $$\int x\,dx$$
  </p>
    \\begin{xyz} x<br> y\\end{xyz}
  <span>and more \\$ and \\ref{x}</span>
  </div>
`;

const html = htmlDocument(HTML, OPTIONS);

mathjax.handleRetriesFor(() => {

    html.findMath();
    printFound(html);

}).catch(err => console.log(err.stack));
