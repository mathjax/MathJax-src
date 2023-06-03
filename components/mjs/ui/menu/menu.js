import './lib/menu.js';

import {combineDefaults} from '#js/components/global.js';
import {MenuHandler} from '#js/ui/menu/MenuHandler.js';

if (MathJax.startup && typeof window !== 'undefined') {
  MathJax.startup.extendHandler(handler => MenuHandler(handler), 20);
}
