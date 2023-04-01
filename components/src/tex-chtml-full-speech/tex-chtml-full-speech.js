import {startup} from '../startup/init.js';
import {Loader} from '../../../js/components/loader.js';
import '../core/core.js';
import '../input/tex-full/tex-full.js';
import {loadFont} from '../output/chtml/chtml.js';
import '../ui/menu/menu.js';
import '../a11y/assistive-mml/assistive-mml.js';
import '../a11y/sre/sre.js';
import MathMaps from '../../../js/a11y/mathmaps.js';
import base from 'speech-rule-engine/lib/mathmaps/base.json';
import en from 'speech-rule-engine/lib/mathmaps/en.json';
import nemeth from 'speech-rule-engine/lib/mathmaps/nemeth.json';

Loader.preLoad(
  'loader', 'startup',
  'core',
  'input/tex-full',
  'output/chtml',
  'ui/menu',
  'a11y/assistive-mml',
  'a11y/sre'
);

MathMaps.set('base', base);
MathMaps.set('en', en);
MathMaps.set('nemeth', nemeth);

loadFont(startup, true);
