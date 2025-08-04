/*************************************************************
 *
 *  Copyright (c) 2018-2025 The MathJax Consortium
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

/**
 * Computes the current ClearSpeak preference, by either extracting it from the
 * settings, returning the previously stored one, or returning the default.
 *
 * @param {string} settings The current speech rule options setting.
 * @returns {string} The current ClearSpeak preference.
 */
function currentPreference(settings?: string): string {
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
  const srVariable = menu.pool.lookup('speechRules');
  const previous = currentPreference(menu.settings.speechRules);
  csPrefsSetting = Sre.fromPreference(previous); // Do here
  for (const pref of prefs) {
    menu.factory.get('variable')(
      menu.factory,
      {
        name: 'csprf_' + pref,
        setter: (value: string) => {
          csPrefsSetting[pref] = value;
          srVariable.setValue(
            'clearspeak-' + Sre.toPreference(csPrefsSetting) // Do here
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
 * Map for storing clearspeak preferences per locale, which can vary. They need
 * to be computed only once as they should not change during a single run.
 */
const localePreferences: Map<string, { [prop: string]: string[] }> = new Map();

/**
 * Computes the clearspeak preferences for the given locale via the worker.
 *
 * @param {MJContextMenu} menu The parent menu.
 * @param {string} locale The locale to get.
 */
async function getLocalePreferences(menu: MJContextMenu, locale: string) {
  if (!localePreferences.has(locale)) {
    await (
      menu.mathItem as ExplorerMathItem
    ).generatorPool.getLocalePreferences(localePreferences);
  }
}

/**
 * Map for temporarily storing clearspeak preference categories that is relevant
 * for a particular node that is currently focused. They are computed on the fly
 * in the worker. To coordinate messages we use an increasing counter.
 */
const relevantPreferences: Map<number, string> = new Map();
let counter = 0;

/**
 * Generate the selection box for the Clearspeak Preferences.
 *
 * @param {MJContextMenu} menu The current context menu.
 * @param {string} locale The current locale.
 * @returns {Promise<object>} The constructed selection box sub menu.
 */
function csSelectionBox(menu: MJContextMenu, locale: string): object {
  const props = localePreferences.get(locale);
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
 *  default, when no other information is available
 *  the value read from localStorage if there is one for clearspeak
 *  previousPrefs that remembers the value before switching to Mathspeak
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
  const loc = localePreferences.get(locale);
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
        id: 'clearspeak-' + Sre.addPreference(previous, key, value), // Do here
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
            dom1 === dom2 && !Sre.fromPreference(pref)[key] // Do here
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
 * @param {(sub: SubMenu) => void} callback Callback to apply on the constructed
 *   submenu.
 */
export async function clearspeakMenu(
  menu: MJContextMenu,
  sub: Submenu,
  callback: (sub: SubMenu) => void
) {
  const exit = (items: object[]) => {
    callback(
      menu.factory.get('subMenu')(
        menu.factory,
        {
          items: items,
          id: 'Clearspeak',
        },
        sub
      )
    );
  };
  if (!menu.settings.speech || !menu.settings.enrich) {
    exit([]);
    return;
  }
  const locale = menu.pool.lookup('locale').getValue() as string;
  await getLocalePreferences(menu, locale);
  if (!localePreferences.get(locale)) {
    exit([]);
    return;
  }
  const box = csSelectionBox(menu, locale);
  let items: object[] = [];
  if (menu.settings.speech) {
    const item = menu.mathItem as ExplorerMathItem;
    const explorer = item?.explorers?.speech;
    const previous = currentPreference(menu.settings.speechRules);
    items = items.concat(basePreferences(previous));
    const focus = explorer?.refocus;
    const semantic = focus?.getAttribute('data-semantic-id') ?? null;
    const count = counter++;
    await item.generatorPool.getRelevantPreferences(
      item,
      semantic,
      relevantPreferences,
      count
    );
    const smart = relevantPreferences.get(count);
    relevantPreferences.delete(count);
    if (smart) {
      const smartItems = smartPreferences(previous, smart, locale);
      items = items.concat(smartItems);
    }
  }
  items.splice(2, 0, box);
  exit(items);
}
MJContextMenu.DynamicSubmenus.set('Clearspeak', [clearspeakMenu, 'speech']);

let LOCALE_MENU: SubMenu = null;

/**
 * Creates dynamic locale menu.
 *
 * @param {MJContextMenu} menu The context menu.
 * @param {Submenu} sub The submenu to attach elements to.
 * @param {(sub: SubMenu) => void} callback Callback to apply on the constructed
 *   submenu.
 */
export function localeMenu(
  menu: MJContextMenu,
  sub: Submenu,
  callback: (sub: SubMenu) => void
) {
  if (LOCALE_MENU) {
    callback(LOCALE_MENU);
    return;
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
  callback(LOCALE_MENU);
}
MJContextMenu.DynamicSubmenus.set('A11yLanguage', [localeMenu, 'speech']);
