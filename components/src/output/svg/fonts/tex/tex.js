import './lib/tex.js';

import {TeXFont} from '../../../../../../mathjax3/output/svg/fonts/tex.js';
import {combineDefaults} from '../../../../../../mathjax3/components/global.js';
import {selectOptionsFromKeys} from '../../../../../../mathjax3/util/Options.js';

if (MathJax.startup) {
    const options = selectOptionsFromKeys(MathJax.config.svg || {}, TeXFont.OPTIONS);
    combineDefaults(MathJax.config, 'svg', {font: new TeXFont(options)});
}
