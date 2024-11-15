import './lib/menu.js';

import {combineDefaults} from '#js/components/global.js';
import {MenuHandler} from '#js/ui/menu/MenuHandler.js';
import {hasWindow} from '#js/util/context.js';

if (MathJax.startup && hasWindow) {
  MathJax.startup.extendHandler(handler => MenuHandler(handler), 20);
}
