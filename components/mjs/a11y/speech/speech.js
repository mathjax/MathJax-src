import './lib/speech.js';

import {SpeechHandler} from '#js/a11y/speech.js';
import {hasWindow} from '#js/util/context.js';

if (MathJax.startup && hasWindow) {
  MathJax.startup.extendHandler(handler => SpeechHandler(handler));
}
