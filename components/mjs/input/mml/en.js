import { Locale } from '#js/util/Locale.js';
import { COMPONENT } from '#js/input/mathml/__locales__/Component.js';
import data from '#ts/input/mathml/__locales__/en.json' with {type: 'json'};

Locale.registerMessages(COMPONENT, 'en', data);
