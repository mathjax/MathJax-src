import {mathjax} from '../mathjax3/mathjax.js';

import {AsciiMath} from '../mathjax3/input/asciimath.js';
import {adaptor, htmlDocument} from './lib/chooseHTML.js';
import {printFound} from './lib/found.js';

const OPTIONS = {
  InputJax: new AsciiMath()
};

const HTML = [
  'This is some math: `x = y` and `x < z`.',
  '<div>',
  'text',
  '<!-- comment -->',
  '<p>',
  '`(x+1)/(x-1)`',
  'and',
  '`int x dx`',
  '</p>',
  '` x<br> y `',
  '<span>and more `z-1`</span>',
  '</div>'
].join('\n');

const html = htmlDocument(HTML, OPTIONS);

mathjax.handleRetriesFor(() => {

    html.findMath();
    printFound(html);

}).catch(err => console.log(err.stack));
