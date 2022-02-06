import './lib/sre.js';

import {Package} from '../../../../js/components/package.js';

if (MathJax.startup) {
  console.log('Bundled Path!');
  let path = Package.resolvePath('[sre]', false) + '/mathmaps';
  console.log(path);
  if (typeof window !== 'undefined') {
    console.log(2);
    window.SREfeature = {json: path};
  } else {
    console.log(3);
    // TODO: This is does not yet work correctly!
    global.SREfeature = {json: path};
  }
}

