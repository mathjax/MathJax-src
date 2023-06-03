import './lib/chtml.js';

import {CHTML} from '#js/output/chtml.js';
import {DefaultFont, fontName} from '#js/output/chtml/DefaultFont.js';
import {OutputUtil} from '../util.js';

OutputUtil.config('chtml', CHTML, fontName, DefaultFont);

export function loadFont(startup, preload) {
  return OutputUtil.loadFont(startup, 'chtml', fontName, preload);
}

