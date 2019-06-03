import './lib/tex-full.js';

import {registerTeX} from '../tex/register.js';
import {Loader} from '../../../../mathjax3/components/loader.js';
import {AllPackages} from '../../../../mathjax3/input/tex/AllPackages.js';
import '../../../../mathjax3/input/tex/require/RequireConfiguration.js';

Loader.preLoad(
    'input/tex-base',
    '[tex]/all-packages',
    '[tex]/require'
);

registerTeX(['require',...AllPackages]);
