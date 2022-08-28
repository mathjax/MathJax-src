import './lib/chtml.js';

import {combineDefaults} from '../../../../../../js/components/global.js';
import {Package} from '../../../../../../js/components/package.js';
import {TeXFont} from '../../../../../../js/output/fonts/tex/chtml.js';

MathJax.startup &&
  combineDefaults(MathJax.config, 'chtml', {
    fontURL: Package.resolvePath('output/fonts/tex/chtml/woff-v2', false),
    font: TeXFont
  });
