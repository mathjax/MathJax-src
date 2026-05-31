import { Locale } from '#js/util/Locale.js';
import { COMPONENT } from '#js/input/tex/unicode/__locales__/Component.js';
import data from '#ts/input/tex/unicode/__locales__/en.json' with {type: 'json'};

Locale.registerMessages(COMPONENT, 'en', data);
