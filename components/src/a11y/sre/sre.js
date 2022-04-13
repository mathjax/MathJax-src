import './lib/sre.js';

import {Package} from '../../../../js/components/package.js';

import Sre from '../../../../js/a11y/sre.js';

// This sets up the correct link to the mathmaps files.
//
// We could also use a custom method for loading locales that are webpacked into
// the distribution.
if (MathJax.startup) {

  const path = Package.resolvePath('[sre]', false) + '/mathmaps';

  if (typeof window !== 'undefined') {
    window.SREfeature = {json: path,
                         custom: (loc) => Sre.preloadLocales(loc)
                        };
  } else {
    // TODO: This is does not yet work correctly!
    global.SREfeature = {json: path,
                         // delay: true,
                         custom: (loc) => Sre.preloadLocales(loc)
                        };
  }
}
