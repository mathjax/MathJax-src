import {Loader} from '#js/components/loader.js';
import '../input/mml/init.js';
import {Sre} from './sre/sre.js';
import './semantic-enrich/semantic-enrich.js';
import './explorer/explorer.js';
import {MathMaps} from '#js/a11y/mathmaps.js';

const base = require('speech-rule-engine/lib/mathmaps/base.json');
const en = require('speech-rule-engine/lib/mathmaps/en.json');
const nemeth = require('speech-rule-engine/lib/mathmaps/nemeth.json');

Loader.preLoad(
  'a11y/sre',
  'a11y/semantic-enrich',
  'a11y/explorer'
);

MathMaps.set('base', base);
MathMaps.set('en', en);
MathMaps.set('nemeth', nemeth);

export function checkSre(startup) {
  return () => startup(() => Sre.sreReady());
}
