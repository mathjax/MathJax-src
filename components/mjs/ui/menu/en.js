import { Locale } from '#js/util/Locale.js';
import { COMPONENT } from '#js/ui/menu/__locales__/Component.js';
import data from '#ts/ui/menu/__locales__/en.json' with {type: 'json'};

Locale.registerMessages(COMPONENT, 'en', data);
