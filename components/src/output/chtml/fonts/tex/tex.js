import './lib/tex.js';

import {combineDefaults} from '../../../../../../js/components/global.js';
import {Package} from '../../../../../../js/components/package.js';
import {TeXFont} from '../../../../../../js/output/chtml/fonts/tex.js';

MathJax.startup &&
  combineDefaults(MathJax.config, 'chtml', {
    fontURL: Package.resolvePath('output/chtml/fonts/woff-v2', false),
    font: TeXFont
  });
