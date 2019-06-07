import {mathjax} from '../mathjax3/mathjax.js';

import {MathML} from '../mathjax3/input/mathml.js';
import {htmlDocument} from './lib/chooseHTML.js';

const OPTIONS = {
  InputJax: new MathML()
};

const HTML = `
  This is some math: <math><mi>x</mi></math>.
  <div>
  text
  <!-- comment -->
  <p>
  <m:math>
    <m:mi>y</m:mi>
  </m:math>
  end
  </p>
  <span>and more <math><mtext>here</mtext></math></span>
  </div>
`;

const html = htmlDocument(HTML, OPTIONS);

mathjax.handleRetriesFor(() => {

    html.findMath();
    for (const math of html.math) {
      console.log(math.math, math.display);
      console.log('');
    };

}).catch(err => console.log(err.stack));
