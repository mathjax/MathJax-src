import './lib/svg.js';

import {TeXFont} from '../../../../../../js/output/fonts/tex/svg.js';
import {combineDefaults} from '../../../../../../js/components/global.js';

MathJax.startup && combineDefaults(MathJax.config, 'svg', {font: TeXFont});
