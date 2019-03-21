import './lib/context-menu.js';

import {MenuHandler} from '../../../mathjax3/ui/menu/MenuHandler.js';

if (MathJax.startup) {
    MathJax.startup.extendHandler(handler => MenuHandler(handler), 20);
}

