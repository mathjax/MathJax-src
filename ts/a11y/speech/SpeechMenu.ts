/*************************************************************
 *
 *  Copyright (c) 2018-2023 The MathJax Consortium
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
 * @fileoverview Clearspeak preference menu.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { SpeechExplorer } from '../explorer/KeyExplorer.js';
import { ExplorerMathItem } from '../explorer.js';
import {MJContextMenu} from '../../ui/menu/MJContextMenu.js';
import {SubMenu, Submenu} from '../../ui/menu/mj-context-menu.js';
import {Sre} from '../sre.js';

/**
 * Values for the ClearSpeak preference variables.
 */
let csPrefsSetting: {[pref: string]: string} = {};

/**
 * Generator of all variables for the Clearspeak Preference settings.
 * @param {MJContextMenu} menu The current context menu.
 * @param {string[]} prefs The preferences.
 */
function csPrefsVariables(menu: MJContextMenu, prefs: string[]) {
  let srVariable = menu.pool.lookup('speechRules');
  let previous = Sre.clearspeakPreferences.currentPreference();
  csPrefsSetting = Sre.clearspeakPreferences.fromPreference(previous);
  for (let pref of prefs) {
    menu.factory.get('variable')(menu.factory, {
      name: 'csprf_' + pref,
      setter: (value: string) => {
        csPrefsSetting[pref] = value;
        srVariable.setValue(
          'clearspeak-' +
            Sre.clearspeakPreferences.toPreference(csPrefsSetting)
        );
      },
      getter: () => { return csPrefsSetting[pref] || 'Auto'; }
    }, menu.pool);
  }
}

/**
 * Generate the selection box for the Clearspeak Preferences.
 * @param {MJContextMenu} menu The current context menu.
 * @param {string} locale The current locale.
 */
function csSelectionBox(menu: MJContextMenu, locale: string) {
  let prefs = Sre.clearspeakPreferences.getLocalePreferences();
  let props = prefs[locale];
  if (!props) {
    let csEntry = menu.findID('Accessibility', 'Speech', 'Clearspeak');
    if (csEntry) {
      csEntry.disable();
    }
    return null;
  }
  csPrefsVariables(menu, Object.keys(props));
  let items = [];
  for (const prop of Object.getOwnPropertyNames(props)) {
    items.push({
      'title': prop,
      'values': props[prop].map(x => x.replace(RegExp('^' + prop + '_'), '')),
      'variable': 'csprf_' + prop
    });
  }
  let sb = menu.factory.get('selectionBox')(menu.factory, {
    'title': 'Clearspeak Preferences',
    'signature': '',
    'order': 'alphabetic',
    'grid': 'square',
    'selections': items
  }, menu);
  return {'type': 'command',
          'id': 'ClearspeakPreferences',
          'content': 'Select Preferences',
          'action': () => sb.post(0, 0)};
}

/**
 * Generates the menu items for the base preference menu.
 *
 * @param {string} previous The currently set preferences.
 * @return The menu items.
 */
function basePreferences(previous: string) {
  const items = [
    {
      type: 'radio',
      content: 'No Preferences',
      id: 'clearspeak-default',
      variable: 'speechRules'
    },
    {
      type: 'radio',
      content: 'Current Preferences',
      id: 'clearspeak-' + previous,
      variable: 'speechRules'
    },
    {
      type: 'rule'
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
 * @return The menu of the smart choices.
 */
function smartPreferences(previous: string, smart: string, locale: string) {
  const prefs = Sre.clearspeakPreferences.getLocalePreferences();
  const loc = prefs[locale];
  if (!loc) {
    return [];
  }
  const items = [
    {type: 'label', content: 'Preferences for ' + smart},
    {type: 'rule'}
  ];
  return items.concat(loc[smart].map(function (x) {
    const [key, value] = x.split('_');
    return {
      type: 'radioCompare',
      content: value,
      id:
      'clearspeak-' + Sre.clearspeakPreferences.addPreference(previous, key, value),
      variable: 'speechRules',
      comparator: (x: string, y: string) => {
        if (x === y) {
          return true;
        }
        if (value !== 'Auto') {
          return false;
        }
        let [dom1, pref] = x.split('-');
        let [dom2] = y.split('-');
        return dom1 === dom2 && !Sre.clearspeakPreferences.fromPreference(pref)[key];
      }
    };
  }));
}

/**
 * Creates dynamic clearspeak menu.
 * @param {MJContextMenu} menu The context menu.
 * @param {Submenu} sub The submenu to attach elements to.
 */
export function clearspeakMenu(menu: MJContextMenu, sub: Submenu) {
  let locale = menu.pool.lookup('locale').getValue() as string;
  const box = csSelectionBox(menu, locale);
  let items: Object[] = [];
  let explorer = (menu.mathItem as ExplorerMathItem)?.
    explorers?.explorers?.speech as SpeechExplorer;
  if (explorer?.walker) {
    let semantic = explorer.walker.getFocus()?.getSemanticPrimary();
    if (semantic) {
      const previous = Sre.clearspeakPreferences.currentPreference();
      const smart = Sre.clearspeakPreferences.relevantPreferences(semantic);
      items = items.concat(basePreferences(previous));
      items = items.concat(smartPreferences(previous, smart, locale));
    }
  }
  if (box) {
    items.splice(2, 0, box);
  }
  return menu.factory.get('subMenu')(menu.factory, {
    items: items,
    id: 'Clearspeak'
  }, sub);
}
MJContextMenu.DynamicSubmenus.set('Clearspeak', clearspeakMenu);

let LOCALE_MENU: SubMenu = null;
/**
 * Creates dynamic locale menu.
 * @param {MJContextMenu} menu The context menu.
 * @param {Submenu} sub The submenu to attach elements to.
 */
export function localeMenu(menu: MJContextMenu, sub: Submenu) {
  if (LOCALE_MENU) {
    return LOCALE_MENU;
  }
  let radios: {type: string, id: string,
               content: string, variable: string}[] = [];
  for (let lang of Sre.locales.keys()) {
    if (lang === 'nemeth' || lang === 'euro') continue;
    radios.push({type: 'radio', id: lang,
                 content: Sre.locales.get(lang) || lang, variable: 'locale'});
  }
  radios.sort((x, y) => x.content.localeCompare(y.content, 'en'));
  LOCALE_MENU = menu.factory.get('subMenu')(menu.factory, {
    items: radios, id: 'Language'}, sub);
  return LOCALE_MENU;
}
MJContextMenu.DynamicSubmenus.set('A11yLanguage', localeMenu);
