import {Locale} from '#js/util/Locale.js';

Locale.isComponent = true;
for (const location of Object.values(Locale.locations)) {
  location[0].replace(/^(?:\.\.\/)*ts\//, '[mathjax]/');
}
