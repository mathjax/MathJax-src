import './lib/sre.js';

import {Package} from '../../../../js/components/package.js';

import Sre from '../../../../js/a11y/sre.js';
import MathMaps from '../../../../js/a11y/mathmaps.js';
import base from 'speech-rule-engine/lib/mathmaps/base.json';
import en from 'speech-rule-engine/lib/mathmaps/en.json';
import nemeth from 'speech-rule-engine/lib/mathmaps/nemeth.json';

MathMaps['base'] = base;
MathMaps['en'] = en;
MathMaps['nemeth'] = nemeth;


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
