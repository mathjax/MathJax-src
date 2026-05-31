import { Locale } from '#js/util/Locale.js';
import { COMPONENT } from '#js/a11y/explorer/__locales__/Component.js';
import data from '#ts/a11y/explorer/__locales__/en.json' with {type: 'json'};

Locale.registerMessages(COMPONENT, 'en', data);
