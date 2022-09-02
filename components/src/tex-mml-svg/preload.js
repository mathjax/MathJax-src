import {Loader} from '../../../js/components/loader.js';

Loader.preLoad(
  'loader', 'startup',
  'core',
  'input/tex', 'input/mml',
  'output/svg', 'output/fonts/tex/svg.js',
  'ui/menu', 'a11y/assistive-mml'
);
