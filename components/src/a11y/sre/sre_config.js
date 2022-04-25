import {Package} from '../../../../js/components/package.js';

// This sets up the correct link to the mathmaps files.
//
// We could also use a custom method for loading locales that are webpacked into
// the distribution.
if (MathJax.startup) {

  const path = Package.resolvePath('[sre]', false) + '/mathmaps';

  console.log(path);
  console.log(0);
  if (typeof window !== 'undefined') {
    console.log(1);
    window.SREfeature = {json: path};
  } else {
    // TODO: This is does not yet work correctly!
    console.log(2);
    global.SREfeature = {json: path};
  }
}

