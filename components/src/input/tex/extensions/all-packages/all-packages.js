import './lib/all-packages.js';

import {AllPackages} from '../../../../../../mathjax3/input/tex/AllPackages.js';
import '../../../../../../mathjax3/input/tex/autoload/AutoloadConfiguration.js';
import '../../../../../../mathjax3/input/tex/require/RequireConfiguration.js';
import {insert} from '../../../../../../mathjax3/util/Options.js';

if (MathJax.loader) {
    MathJax.loader.preLoad('[tex]/autoload', '[tex]/require');
}
if (MathJax.startup) {
    if (!MathJax.config.tex) {
        MathJax.config.tex = {};
    }
    let packages = MathJax.config.tex.packages;
    MathJax.config.tex.packages = ['autoload', 'require', ...AllPackages];
    if (packages) {
        insert(MathJax.config.tex, {packages});
    }
}
