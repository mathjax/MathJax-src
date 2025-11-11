import {Loader} from '#js/components/loader.js';
import '../input/mml/init.js';
import './sre/sre.js';
import './semantic-enrich/semantic-enrich.js';
import './speech/speech.js';
import './explorer/explorer.js';

Loader.preLoaded(
  'a11y/sre',
  'a11y/semantic-enrich',
  'a11y/speech',
  'a11y/explorer',
  'input/mml',
);
