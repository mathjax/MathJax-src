import { Locale, messageData } from '#js/util/Locale.js';
import { localeJsonFile } from '#src/constants.js';
import * as fs from 'fs';
import '#js/util/asyncLoad/esm.js';
import '#js/core/__locales__/Component.js';

declare const MathJax: any;

/**
 * Find directory for a component
 *
 * @param {string} component   The component name
 * @returns {string}           The directory (in ts) for the compoment
 */
function getName(component: string): string {
  let name = (Locale as any).locations[component][0];
  if (name.charAt(0) === '[' && typeof MathJax !== 'undefined') {
    name = MathJax._.components?.package.Package.resolvePath(name, false);
  }
  return (
    name
      .replace(/.*\/(?:ts|bundle)\//, '')
      .replace(/extensions\//, '')
      .replace(/\/__locales__$/, '')
  );
}

Object.assign(Locale, {
  _lookupMessage_: Locale.lookupMessage,
  _registerMessages_: Locale.registerMessages,
  //
  // Record the message IDs for the component
  //
  lookupMessage(component: string, id: string) {
    if (this.current === 'en') {
      const jsonData = {component: getName(component), id};
      fs.appendFileSync(localeJsonFile, ',' + JSON.stringify(jsonData, null, 2));
    }
    if (!this.data[component]?.[this.current]?.[id] && id !== 'Id1' && id !== 'Id2' && id !== 'test') {
      const jsonData = {component: getName('locale'), id};
      fs.appendFileSync(localeJsonFile, ',' + JSON.stringify(jsonData, null, 2));
    }
    if (
      !this.data[component]?.[this.current]?.[id] &&
      !this.data[component]?.[this.default]?.[id] &&
      (this.current === 'en' || !this.data.locale[this.current]?.['MessageNotFound'])
    ) {
      const jsonData = {component: getName('locale'), id: 'MessageNotFound'};
      fs.appendFileSync(localeJsonFile, ',' + JSON.stringify(jsonData, null, 2));
    }
    return this._lookupMessage_(component, id);
  },
  //
  // Record the ids that get used
  //
  registerMessages(
    component: string,
    locale: string,
    data: messageData
  ) {
    this._registerMessages_(component, locale, data);
    if (!locale || !this.locations[component] || locale !== 'en') return;
    const jsonData = {
      component: getName(component),
      ids: Array.from(Object.keys(data))
    };
    fs.appendFileSync(localeJsonFile, ',' + JSON.stringify(jsonData, null, 2));
  },
});

//
// Get any data that is already loaded
//
const data = (Locale as any).data;
for (const component of Object.keys(data)) {
  if (!data[component].en) continue;
  const jsonData = {
    component: getName(component),
    ids: Array.from(Object.keys(data[component].en))
  };
  fs.appendFileSync(localeJsonFile, ',' + JSON.stringify(jsonData, null, 2));
}

Locale.setLocale();
