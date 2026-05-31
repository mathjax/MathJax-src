import { Locale } from '#js/util/Locale.js';
import { COMPONENT } from '#js/input/tex/__locales__/Component.js';
import { COMPONENT as BASE } from '#js/input/tex/base/__locales__/Component.js';
import data from '#ts/input/tex/__locales__/en.json' with {type: 'json'};
import basedata from '#ts/input/tex/base/__locales__/en.json' with {type: 'json'};

Locale.registerMessages(COMPONENT, 'en', data);
Locale.registerMessages(BASE, 'en', basedata);
