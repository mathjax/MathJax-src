import {MathJax} from 'mathjax3/mathjax.js';

import 'mathjax3/handlers/html.js';
import {TeX} from 'mathjax3/input/tex.js';

import {JsonMmlVisitor} from 'mathjax3/core/MmlTree/JsonMmlVisitor.js';

import {Test} from './tests.js';


export class ParserTest extends Test {

  constructor() {
    super();
  }

  // Tests exclusively the timing of the Translate method.
  runTest(name, tex, expected) {
    this.test(
      name,
      t => {
        MathJax.handleRetriesFor(function() {
          let html = MathJax.document('<html></html>', {
            InputJax: new TeX()
          });
          html.TestMath(tex).compile();
          let jv = new JsonMmlVisitor();
          let actual = jv.visitTree(html.math.pop().root);
          t.deepEqual(actual, expected, name);
        }).catch(err => {
          console.log(err.message);
          console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/, ''));
        });
      }
    );
  }
  
  ignoreTest(name, tex, expected) {
  }
  
}
