import './lib/all-packages.js';

import {AllPackages} from '../../../../../../mathjax3/input/tex/AllPackages.js';
import {insert} from '../../../../../../mathjax3/util/Options.js';

Loader.preLoad(
    '[tex]/action',
    '[tex]/ams',
    '[tex]/ams_cd',
    '[tex]/bbox',
    '[tex]/boldsymbol',
    '[tex]/braket',
    '[tex]/cancel',
    '[tex]/color',
    '[tex]/configMacros',
    '[tex]/enclose',
    '[tex]/extpfeil',
    '[tex]/html',
    '[tex]/mhchem',
    '[tex]/newcommand',
    '[tex]/noerrors',
    '[tex]/noundefined',
    '[tex]/physics',
    '[tex]/require',
    '[tex]/unicode',
    '[tex]/verb'
);

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
