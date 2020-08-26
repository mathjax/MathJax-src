import './lib/stix2.js';

import {STIX2Font} from '../../../../../../js/output/svg/fonts/stix2.js';
import {combineDefaults} from '../../../../../../js/components/global.js';
import {selectOptionsFromKeys} from '../../../../../../js/util/Options.js';

if (MathJax.startup) {
  const options = selectOptionsFromKeys(MathJax.config.svg || {}, STIX2Font.OPTIONS);
  combineDefaults(MathJax.config, 'svg', {font: new STIX2Font(options)});
}
