import {VERSION} from '#js/components/version.js';
import '#js/ui/no-dark-mode/no-dark-mode.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('ui/no-dark-mode', VERSION, 'extension');
}

