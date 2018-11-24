import {MathJax} from '../mathjax3/mathjax.js';

import {TeX} from '../mathjax3/input/tex.js';
import {CHTML} from '../mathjax3/output/chtml.js';
import {RegisterHTMLHandler} from '../mathjax3/handlers/html.js';
import {chooseAdaptor} from '../mathjax3/adaptors/chooseAdaptor.js';
import {AllPackages} from '../mathjax3/input/tex/AllPackages.js';

const adaptor = chooseAdaptor();
RegisterHTMLHandler(adaptor);

let html = MathJax.document('<html></html>', {
  InputJax: new TeX({packages: AllPackages}),
  OutputJax: new CHTML()
});

MathJax.handleRetriesFor(() => {

    html.TestMath(process.argv[3] || '').compile().typeset();
    let math = html.math.pop();
    console.log(adaptor.outerHTML(math.typesetRoot));

}).catch(err => console.log(err.stack));
