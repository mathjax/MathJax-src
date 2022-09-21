import {startup} from '../startup/init.js';
import {Loader} from '../../../js/components/loader.js';
import '../core/core.js';
import '../input/mml/mml.js';
import {loadFont} from '../output/svg/svg.js';
import '../ui/menu/menu.js';
import '../a11y/assistive-mml/assistive-mml.js';

Loader.preLoad(
  'loader', 'startup',
  'core',
  'input/mml',
  'output/svg',
  'ui/menu',
  'a11y/assistive-mml'
);

loadFont(startup, true);
