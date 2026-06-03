import {MathJax} from '#js/components/global.js';

if (!Object.hasOwn && MathJax.config.startup.polyfillHasOwn) {
  Object.hasOwn = function (el, prop) {
    if (typeof el === 'undefined' || el === null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    return Object.prototype.hasOwnProperty.call(Object(el), prop);
  }
}
