import './lib/tex.js';

import {registerTeX} from './register.js';
import {Loader} from '#js/components/loader.js';

Loader.preLoaded(
  'input/tex-base',
  '[tex]/ams',
  '[tex]/newcommand',
  '[tex]/textmacros',
  '[tex]/noundefined',
  '[tex]/require',
  '[tex]/autoload',
  '[tex]/configmacros'
);

registerTeX([
  'base',
  'ams',
  'newcommand',
  'textmacros',
  'noundefined',
  'require',
  'autoload',
  'configmacros'
]);
