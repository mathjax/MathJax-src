import './lib/tex.js';

import {TeXFont} from '../../../../../../js/output/svg/fonts/tex.js';
import {combineDefaults} from '../../../../../../js/components/global.js';

MathJax.startup && combineDefaults(MathJax.config, 'svg', {font: TeXFont});
