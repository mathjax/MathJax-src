import {startup} from '../startup/init.js';
import {Loader} from '../../../js/components/loader.js';
import '../core/core.js';
import '../input/tex/tex.js';
import {loadFont} from '../output/chtml/chtml.js';
import '../ui/menu/menu.js';
import '../a11y/assistive-mml/assistive-mml.js';

Loader.preLoad(
  'loader', 'startup',
  'core',
  'input/tex',
  'output/chtml',
  'ui/menu',
  'a11y/assistive-mml'
);
Loader.saveVersion('tex-chtml');

loadFont(startup, true);
