import {VERSION} from '#js/components/version.js';
export * from '#js/a11y/sre/speech-workerpool.js';

if (typeof MathJax !== 'undefined' && MathJax.loader) {
  MathJax.loader.checkVersion('sre/speech-workerpool', VERSION, 'sre/speech-workerpool');
}
