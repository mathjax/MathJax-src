import {Loader} from '../../../js/components/loader.js';
import '../input/mml/init.js';
import {Sre} from '../a11y/sre/sre.js';
import '../a11y/semantic-enrich/semantic-enrich.js';
import '../a11y/explorer/explorer.js';
import MathMaps from '../../../js/a11y/mathmaps.js';
import base from 'speech-rule-engine/lib/mathmaps/base.json';
import en from 'speech-rule-engine/lib/mathmaps/en.json';
import euro from 'speech-rule-engine/lib/mathmaps/euro.json';

Loader.preLoad(
  'a11y/sre',
  'a11y/semantic-enrich',
  'a11y/explorer'
);

MathMaps.set('base', base);
MathMaps.set('en', en);
MathMaps.set('euro', euro);

export function checkSre(startup) {
  return () => startup(() => Sre.sreReady());
}
