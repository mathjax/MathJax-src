import './lib/tex-full.js';

import {registerTeX} from '../tex/register.js';
import {Loader} from '../../../../mathjax3/components/loader.js';
import {AllPackages} from '../../../../mathjax3/input/tex/AllPackages.js';

Loader.preLoad(
    'input/tex-base',
    '[tex]/all-packages',
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

registerTeX(AllPackages);
