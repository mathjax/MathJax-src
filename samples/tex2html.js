import {MathJax} from '../mathjax3/mathjax.js';

import {TeX} from '../mathjax3/input/tex.js';
import {CHTML} from '../mathjax3/output/chtml.js';
import {RegisterHTMLHandler} from '../mathjax3/handlers/html.js';
import {chooseAdaptor} from '../mathjax3/adaptors/chooseAdaptor.js';
import {STATE} from '../mathjax3/core/MathItem.js';

const adaptor = chooseAdaptor();
RegisterHTMLHandler(adaptor);

let html = MathJax.document('<html></html>', {
  InputJax: new TeX(),
  OutputJax: new CHTML()
});

MathJax.handleRetriesFor(() => {

    let math = html.convert(process.argv[3] || '', {end: STATE.TYPESET});
    console.log(adaptor.outerHTML(math.typesetRoot));

}).catch(err => console.log(err.stack));
