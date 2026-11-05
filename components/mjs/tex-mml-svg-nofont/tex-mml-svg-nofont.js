import { startup, readyAfter } from '../startup/init.js';
import { Loader } from '#js/components/loader.js';
import '../core/core.js';
import '../input/tex/tex.js';
import '../input/mml/mml.js';
import { loadFont } from '../output/svg/svg.js';
import '../ui/menu/menu.js';
import '../a11y/util.js';

const COMPONENT = 'tex-mml-svg-nofont';

Loader.preLoaded(
  'loader', 'startup',
  'core',
  'input/tex', 'input/mml',
  'output/svg',
  'ui/menu'
);
Loader.saveVersion(COMPONENT);

readyAfter(COMPONENT, () => loadFont(startup));
