import './lib/svg.js';

import {SVG} from '#js/output/svg.js';
import {DefaultFont, fontName} from '#js/output/svg/DefaultFont.js';
import {OutputUtil} from '../util.js';

OutputUtil.config('svg', SVG, fontName, DefaultFont);

export function loadFont(startup, preload) {
  return OutputUtil.loadFont(startup, 'svg', fontName, preload);
}

