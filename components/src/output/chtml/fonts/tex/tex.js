import './lib/tex.js';

import {combineDefaults} from '../../../../../../mathjax3/components/global.js';
import {Package} from '../../../../../../mathjax3/components/package.js';
import {selectOptionsFromKeys} from '../../../../../../mathjax3/util/Options.js';
import {TeXFont} from '../../../../../../mathjax3/output/chtml/fonts/tex.js';

if (MathJax.startup) {
    combineDefaults(MathJax.config, 'chtml', {
        fontURL: Package.resolvePath('output/chtml/fonts/woff-v2', false)
    });
    const options = selectOptionsFromKeys(MathJax.config.chtml || {}, TeXFont.OPTIONS);
    combineDefaults(MathJax.config, 'chtml', {font: new TeXFont(options)});
}
