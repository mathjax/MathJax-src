import {liteAdaptor} from '../mathjax3/adaptors/liteAdaptor.js';
import {jsdomAdaptor} from '../mathjax3/adaptors/jsdomAdaptor.js';

import {JSDOM} from 'jsdom';

const adaptor = liteAdaptor();
const jsdom = jsdomAdaptor(JSDOM);

const math = process.argv[3] || '';

console.log(adaptor.outerHTML(adaptor.root(adaptor.parse(math))));
console.log(jsdom.outerHTML(jsdom.root(jsdom.parse(math))));
