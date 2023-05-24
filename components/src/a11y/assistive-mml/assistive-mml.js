import './lib/assistive-mml.js';

import {combineDefaults} from '#js/components/global.js';
import {AssistiveMmlHandler} from '#js/a11y/assistive-mml.js';

if (MathJax.startup) {
  if (MathJax.config.options && MathJax.config.options.enableAssistiveMml !== false) {
    combineDefaults(MathJax.config, 'options', {
      menuOptions: {
        settings: {
          assistiveMml: true
        }
      }
    });
  }
  MathJax.startup.extendHandler(handler => AssistiveMmlHandler(handler));
}
