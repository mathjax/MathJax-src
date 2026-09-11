import { startup, readyAfter } from '../startup/init.js';
import { Loader } from '#js/components/loader.js';
import '../core/core.js';
import '../input/mml/mml.js';
import { loadFont } from '../output/chtml/chtml.js';
import '../ui/menu/menu.js';
import '../a11y/util.js';

const COMPONENT = 'mml-chtml';

Loader.preLoaded(
  'loader', 'startup',
  'core',
  'input/mml',
  'output/chtml',
  'ui/menu'
);
Loader.saveVersion(COMPONENT);

readyAfter(COMPONENT, () => loadFont(startup, true));
