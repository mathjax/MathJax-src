import { Locale } from '#js/util/Locale.js';
import { COMPONENT } from '#js/core/__locales__/Component.js';
import data from '#ts/core/__locales__/en.json' with {type: 'json'};

Locale.registerMessages(COMPONENT, 'en', data);
