import './lib/context-menu.js';

import {MenuHandler} from '../../../mathjax3/ui/menu/MenuHandler.js';
import {STATE} from '../../../mathjax3/core/MathItem.js';


if (MathJax.startup) {
    MathJax.startup.extendHandler(handler => MenuHandler(handler), 20);
    MathJax.startup.typesetCall('addMenu', STATE.CONTEXT_MENU);
    MathJax.startup.convertCall('addMenu', STATE.CONTEXT_MENU);
}

