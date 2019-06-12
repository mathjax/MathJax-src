import {mathjax} from '../../../mathjax3/mathjax.js';

import {TeX} from '../../../mathjax3/input/tex.js';
import {RegisterHTMLHandler} from '../../../mathjax3/handlers/html.js';
import {browserAdaptor} from '../../../mathjax3/adaptors/browserAdaptor.js';
import {HTMLMathItem} from '../../../mathjax3/handlers/html/HTMLMathItem.js';

RegisterHTMLHandler(browserAdaptor());

let html = mathjax.document(document, {InputJax: new TeX()});

import {SerializedMmlVisitor as MmlVisitor} from '../../../mathjax3/core/MmlTree/SerializedMmlVisitor.js';
let visitor = new MmlVisitor();
let toMml = (node => visitor.visitTree(node, html.document));

window.Typeset = function (value, display) {
    const math = new HTMLMathItem(value, html.inputJax[0], display);
    math.setMetrics(16,8,16*20,100000,1);
    math.compile(html);
    return toMml(math.root);
};
