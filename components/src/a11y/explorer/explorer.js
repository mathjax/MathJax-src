import './lib/explorer.js';

import {combineDefaults} from '../../../../js/components/global.js';
import {ExplorerHandler} from '../../../../js/a11y/explorer.js';

if (MathJax.startup) {
  if (MathJax.config.options && MathJax.config.options.enableExplorer !== false) {
    combineDefaults(MathJax.config, 'options', {
      menuOptions: {
        settings: {
          explorer: true
        }
      }
    });
  }
  MathJax.startup.extendHandler(handler => ExplorerHandler(handler));
}
