import {mathjax} from '../mathjax3/mathjax.js';

import {TeX} from '../mathjax3/input/tex.js';
import {RegisterHTMLHandler} from '../mathjax3/handlers/html.js';
import {chooseAdaptor} from '../mathjax3/adaptors/chooseAdaptor.js';
import {STATE} from '../mathjax3/core/MathItem.js';

RegisterHTMLHandler(chooseAdaptor());

let html = mathjax.document('<html></html>', {
  InputJax: new TeX()
});

mathjax.handleRetriesFor(() => {

    let math = html.convert(process.argv[3] || '', {end: STATE.CONVERT});
    console.log(math.toString());

}).catch(err => console.log(err.stack));
