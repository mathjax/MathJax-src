import {mathjax} from '../mathjax3/mathjax.js';

import {TeX} from '../mathjax3/input/tex.js';
import {APPEND} from '../mathjax3/util/Options.js';
import {htmlDocument} from './lib/chooseHTML.js';
import {printFound} from './lib/found.js';

const OPTIONS = {
  InputJax: new TeX({inlineMath: {[APPEND]: [['$', '$']]}})
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
    \\begin{equation} x<br> y\\end{equation}
  <span>and more \\$ and \\ref{x}</span>
  </div>
`;

const html = htmlDocument(HTML, OPTIONS);

mathjax.handleRetriesFor(() => {

    html.findMath();
    printFound(html);

}).catch(err => console.log(err.stack));
