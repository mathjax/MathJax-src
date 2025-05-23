/*************************************************************
 *
 *  Copyright (c) 2018-2024 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * @file Clearspeak preference menu.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { ExplorerMathItem } from '../explorer.js';
import { MJContextMenu } from '../../ui/menu/MJContextMenu.js';
import { SubMenu, Submenu } from '../../ui/menu/mj-context-menu.js';
import * as Sre from '../sre.js';

/**
 * Values for the ClearSpeak preference variables.
 */
let csPrefsSetting: { [pref: string]: string } = {};
let previousPrefs: string = null;

function currentPreference(settings?: string) {
  const matcher = settings?.match(/^clearspeak-(.*)/);
  previousPrefs = (matcher && matcher[1]) ?? previousPrefs ?? 'default';
  return previousPrefs;
}

/**
 * Generator of all variables for the Clearspeak Preference settings.
 *
 * @param {MJContextMenu} menu The current context menu.
 * @param {string[]} prefs The preferences.
 */
function csPrefsVariables(menu: MJContextMenu, prefs: string[]) {
  console.log(69);
  const srVariable = menu.pool.lookup('speechRules');
  const previous = currentPreference();
  csPrefsSetting = Sre.clearspeakPreferences.fromPreference(previous); // Do here
  console.log(csPrefsSetting);
  for (const pref of prefs) {
    menu.factory.get('variable')(
      menu.factory,
      {
        name: 'csprf_' + pref,
        setter: (value: string) => {
          csPrefsSetting[pref] = value;
          srVariable.setValue(
            'clearspeak-' +
              Sre.clearspeakPreferences.toPreference(csPrefsSetting) // Do here
          );
        },
        getter: () => {
          return csPrefsSetting[pref] || 'Auto';
        },
      },
      menu.pool
    );
  }
}

/**
 * Generate the selection box for the Clearspeak Preferences.
 *
 * @param {MJContextMenu} menu The current context menu.
 * @param {string} locale The current locale.
 * @returns {object} The constructed selection box sub menu.
 */
function csSelectionBox(menu: MJContextMenu, locale: string): object {
  // const prefs = Sre.clearspeakPreferences.getLocalePreferences(); // Need SRE
  const item = menu.mathItem as ExplorerMathItem
  item.generatorPool.getLocalePreferences(item);
  const prefs: { [pref: string]: {[prop: string]: string[] }} = {};
  console.log(prefs);
  const props = prefs[locale];
  if (!props) {
    const csEntry = menu.findID('Accessibility', 'Speech', 'Clearspeak');
    if (csEntry) {
      csEntry.disable();
    }
    return null;
  }
  csPrefsVariables(menu, Object.keys(props));
  const items = [];
  for (const prop of Object.getOwnPropertyNames(props)) {
    items.push({
      title: prop,
      values: props[prop].map((x) => x.replace(RegExp('^' + prop + '_'), '')),
      variable: 'csprf_' + prop,
    });
  }
  const sb = menu.factory.get('selectionBox')(
    menu.factory,
    {
      title: 'Clearspeak Preferences',
      signature: '',
      order: 'alphabetic',
      grid: 'square',
      selections: items,
    },
    menu
  );
  return {
    type: 'command',
    id: 'ClearspeakPreferences',
    content: 'Select Preferences',
    action: () => sb.post(0, 0),
  };
}

/**
 * Generates the two menu items for the base preference menu:
 * 1. No Preferences: All preferences are set to Auto.
 *
 * 2. Current Preferences: The last chosen preferences for clearspeak. These are
 * initially set to:
 *  * default, when no other information is available
 *  * the value read from localStorage if there is one for clearspeak
 *  * previousPrefs that remembers the value before switching to Mathspeak
 *
 * @param {string} previous The currently set preferences.
 * @returns {object[]} The menu items as a list of JSON objects.
 */
function basePreferences(previous: string): object[] {
  const items = [
    {
      type: 'radio',
      content: 'No Preferences',
      id: 'clearspeak-default',
      variable: 'speechRules',
    },
    {
      type: 'radio',
      content: 'Current Preferences',
      id: 'clearspeak-' + previous,
      variable: 'speechRules',
    },
    {
      type: 'rule',
    },
  ];
  return items;
}

// TODO(volker): This now needs to go through the worker as well.
/**
 * Generates the items for smart preference choices, depending on the top most
 *
 * @param {string} previous The currently set preferences.
 * @param {string} smart The semantic type of the smart preferences.
 * @param {string} locale The current locale.
 * @returns {object[]} The menu of smart choices as a list of JSON objects.
 */
function smartPreferences(
  previous: string,
  smart: string,
  locale: string
): object[] {
  const prefs = Sre.clearspeakPreferences.getLocalePreferences(); // Need SRE
  const loc = prefs[locale];
  if (!loc) {
    return [];
  }
  const items = [
    { type: 'label', content: 'Preferences for ' + smart },
    { type: 'rule' },
  ];
  return items.concat(
    loc[smart].map(function (x) {
      const [key, value] = x.split('_');
      return {
        type: 'radioCompare',
        content: value,
        id:
          'clearspeak-' +
          Sre.clearspeakPreferences.addPreference(previous, key, value), // Do here
        variable: 'speechRules',
        comparator: (x: string, y: string) => {
          if (x === y) {
            return true;
          }
          if (value !== 'Auto') {
            return false;
          }
          const [dom1, pref] = x.split('-');
          const [dom2] = y.split('-');
          return (
            dom1 === dom2 &&
            !Sre.clearspeakPreferences.fromPreference(pref)[key] // Do here
          );
        },
      };
    })
  );
}

/**
 * Creates dynamic clearspeak menu.
 *
 * @param {MJContextMenu} menu The context menu.
 * @param {Submenu} sub The submenu to attach elements to.
 * @returns {SubMenu} The constructed clearspeak sub menu.
 */
export function clearspeakMenu(menu: MJContextMenu, sub: Submenu): SubMenu {
  console.log(70);

  const locale = menu.pool.lookup('locale').getValue() as string;
  console.log(38);
  const box = csSelectionBox(menu, locale);
  console.log(box);
  console.log(39);
  let items: object[] = [];
  if (menu.settings.speech) {
    console.log(71);
    console.log(menu);
    const explorer = (menu.mathItem as ExplorerMathItem)?.explorers?.speech;
    const semantic = explorer?.refocus;
    console.log(menu.settings.speechRules);
    const previous = currentPreference(menu.settings.speechRules);
    items = items.concat(basePreferences(previous));
    if (semantic) {
      // const smart = Sre.clearspeakPreferences.relevantPreferences(semantic);
      const smart = '';
      console.log(smart);
      items = items.concat(smartPreferences(previous, smart, locale));
    }
    if (box) {
      items.splice(2, 0, box);
    }
  }
  return menu.factory.get('subMenu')(
    menu.factory,
    {
      items: items,
      id: 'Clearspeak',
    },
    sub
  );
}
MJContextMenu.DynamicSubmenus.set('Clearspeak', [clearspeakMenu, 'speech']);

let LOCALE_MENU: SubMenu = null;

/**
 * Creates dynamic locale menu.
 *
 * @param {MJContextMenu} menu The context menu.
 * @param {Submenu} sub The submenu to attach elements to.
 * @returns {SubMenu} The constructed locale sub menu.
 */
export function localeMenu(menu: MJContextMenu, sub: Submenu): SubMenu {
  if (LOCALE_MENU) {
    return LOCALE_MENU;
  }
  const radios: {
    type: string;
    id: string;
    content: string;
    variable: string;
  }[] = [];
  for (const lang of Sre.locales.keys()) {
    if (lang === 'nemeth' || lang === 'euro') continue;
    radios.push({
      type: 'radio',
      id: lang,
      content: Sre.locales.get(lang) || lang,
      variable: 'locale',
    });
  }
  radios.sort((x, y) => x.content.localeCompare(y.content, 'en'));
  LOCALE_MENU = menu.factory.get('subMenu')(
    menu.factory,
    {
      items: radios,
      id: 'Language',
    },
    sub
  );
  return LOCALE_MENU;
}
MJContextMenu.DynamicSubmenus.set('A11yLanguage', [localeMenu, 'speech']);
