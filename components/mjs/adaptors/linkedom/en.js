import { Locale } from '#js/util/Locale.js';
import { COMPONENT } from '#js/adaptors/linkedom/__locales__/Component.js';
import data from '#ts/adaptors/linkedom/__locales__/en.json' with {type: 'json'};

Locale.registerMessages(COMPONENT, 'en', data);
