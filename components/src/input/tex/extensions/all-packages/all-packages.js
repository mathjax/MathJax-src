import './lib/all-packages.js';

import {AllPackages} from '../../../../../../mathjax3/input/tex/AllPackages.js';
import {insert} from '../../../../../../mathjax3/util/Options.js';

if (MathJax.startup) {
    if (!MathJax.config.tex) {
        MathJax.config.tex = {};
    }
    let packages = MathJax.config.tex.packages;
    MathJax.config.tex.packages = [...AllPackages];
    if (packages) {
        insert(MathJax.config.tex, {packages});
    }
}
