import { startup, readyAfter } from '../startup/init.js';
import { Loader } from '#js/components/loader.js';
import '../core/core.js';
import '../input/tex/tex.js';
import { loadFont } from '../output/svg/svg.js';
import '../ui/menu/menu.js';
import '../a11y/util.js';

const COMPONENT = 'tex-svg-nofont';

Loader.preLoaded(
  'core',
  'input/tex',
  'output/svg',
  'ui/menu'
);
Loader.saveVersion(COMPONENT);

readyAfter(COMPONENT, () => loadFont(startup));
