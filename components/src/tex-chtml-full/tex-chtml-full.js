import {startup} from '../startup/init.js';
import {Loader} from '../../../js/components/loader.js';
import '../core/core.js';
import '../input/tex-full/tex-full.js';
import {loadFont} from '../output/chtml/chtml.js';
import '../ui/menu/menu.js';
import '../a11y/assistive-mml/assistive-mml.js';

Loader.preLoad(
  'loader', 'startup',
  'core',
  'input/tex-full',
  'output/chtml',
  'ui/menu',
  'a11y/assistive-mml'
);

loadFont(startup, true);