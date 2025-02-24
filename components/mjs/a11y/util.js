import {Loader} from '#js/components/loader.js';
import '../input/mml/init.js';
import {Sre} from './sre/sre.js';
import './semantic-enrich/semantic-enrich.js';
import './explorer/explorer.js';

Loader.preLoad(
  'a11y/sre',
  'a11y/semantic-enrich',
  'a11y/explorer'
);

export function checkSre(startup) {
  return () => startup(() => Sre.sreReady());
}
