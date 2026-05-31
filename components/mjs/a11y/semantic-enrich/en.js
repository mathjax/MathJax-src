import { Locale } from '#js/util/Locale.js';
import { COMPONENT } from '#js/a11y/semantic-enrich/__locales__/Component.js';
import data from '#ts/a11y/semantic-enrich/__locales__/en.json' with {type: 'json'};

Locale.registerMessages(COMPONENT, 'en', data);
