import {MathML} from './init.js';

if (MathJax.startup) {
  MathJax.startup.registerConstructor('mml', MathML);
  MathJax.startup.useInput('mml');
}
