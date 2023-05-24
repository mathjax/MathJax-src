import '#js/util/entities/all.js';
import {VERSION} from '#js/components/version.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('input/mml/entities', VERSION, 'input/mml/entities');
}
