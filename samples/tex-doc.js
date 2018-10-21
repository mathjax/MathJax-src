import {MathJax} from '../mathjax3/mathjax.js';

import {TeX} from '../mathjax3/input/tex.js';
import {CHTML} from '../mathjax3/output/chtml.js';
//import {SVG} from '../mathjax3/output/svg.js';
import {RegisterHTMLHandler} from '../mathjax3/handlers/html.js';
import {browserAdaptor} from '../mathjax3/adaptors/browserAdaptor.js';

import {ConfigurationHandler} from '../mathjax3/input/tex/Configuration.js';

import '../mathjax3/input/tex/base/BaseConfiguration.js';
import '../mathjax3/input/tex/ams/AmsConfiguration.js';
//import '../mathjax3/input/tex/noundefined/NoUndefinedConfiguration.js';
import '../mathjax3/input/tex/boldsymbol/BoldsymbolConfiguration.js';
import '../mathjax3/input/tex/newcommand/NewcommandConfiguration.js';
//import '../mathjax3/input/tex/braket/BraketConfiguration.js';
//import '../mathjax3/input/tex/mhchem/MhchemConfiguration.js';
import '../mathjax3/input/tex/verb/VerbConfiguration.js';
import '../mathjax3/input/tex/cancel/CancelConfiguration.js';
import '../mathjax3/input/tex/enclose/EncloseConfiguration.js';
import '../mathjax3/input/tex/extpfeil/ExtpfeilConfiguration.js';
import '../mathjax3/input/tex/autobold/AutoboldConfiguration.js';


import {TagsFactory} from '../mathjax3/input/tex/Tags.js';

RegisterHTMLHandler(browserAdaptor());

const OPTIONS = {
  InputJax: new TeX({packages: ['base', 'ams', 'newcommand', 'boldsymbol', 'verb', 'enclose', 'cancel', 'extpfeil', 'autobold'], tags: 'none'}),
  OutputJax: new /*SVG() */CHTML()
};

window.tf = TagsFactory;
const html = MathJax.document(document, OPTIONS);

MathJax.handleRetriesFor(() => {

    html.findMath()
        .compile()
        .getMetrics()
        .typeset()
        .updateDocument();
        
//    console.log(adaptor.outerHTML(adaptor.parent(adaptor.body(html.document))));

}).catch(err => console.log(err.stack));
