import './lib/speech.js';

import {SpeechHandler} from '#js/a11y/speech.js';

if (MathJax.startup) {
  MathJax.startup.extendHandler(handler => SpeechHandler(handler));
}
