import {startup} from '../startup/init.js';
import {Loader} from '#js/components/loader.js';
import '../core/core.js';
import '../input/tex/tex.js';
import {loadFont} from '../output/svg/svg.js';
import '../ui/menu/menu.js';
import '../a11y/util.js';

Loader.preLoaded(
  'core',
  'input/tex',
  'output/svg',
  'ui/menu'
);
Loader.saveVersion('tex-svg-nofont');

loadFont(startup);
