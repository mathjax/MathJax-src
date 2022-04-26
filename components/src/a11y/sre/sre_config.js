import {Package} from '../../../../js/components/package.js';

// This sets up the correct link to the mathmaps files.
if (MathJax.startup) {

  const path = Package.resolvePath('[sre]', false) + '/mathmaps';

  if (typeof window !== 'undefined') {
    window.SREfeature = {json: path};
  } else {
    global.SREfeature = {json: path};
  }
}

