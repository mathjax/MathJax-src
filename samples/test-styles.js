import {Styles} from '../mathjax3/util/styles.js';

import {JSDOM} from 'jsdom';

const document = new JSDOM().window.document;
const span = document.createElement('span');

const cssText = process.argv[3] || '';

let styles = new Styles(cssText);
console.log(styles);
console.log('>> ' + styles.cssText);

span.style.cssText = cssText;
console.log('<< ' +span.style.cssText);
