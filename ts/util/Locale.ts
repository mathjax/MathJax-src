/*************************************************************
 *
 *  Copyright (c) 2024 The MathJax Consortium
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
 * @fileoverview  Implements the locale framework
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {asyncLoad} from './AsyncLoad.js';

/**
 * The various object map types
 */
export type messageData = {[id: string]: string};
export type localeData = {[locale: string]: messageData};
export type componentData = {[component: string]: localeData};
export type namedData = {[name: string | number]: string};

/**
 * The Locale class for handling localized messages
 */
export class Locale {

  /**
   * The current locale
   */
  public static current: string = 'en';

  /**
   * True when the core component has been loaded (and so the Package path resolution is available
   */
  public static isComponent: boolean = false;

  /**
   * The localized message strings, per component and locale
   */
  protected static data: componentData = {};

  /**
   * The locale files to load for each locale (as registered by the components)
   */
  protected static files: {[locale: string]: {component: string, file: string}[]} = {en: []};

  /**
   * Registers a given component's locale files
   *
   * @param{string} component   The component's name (e.g., [tex]/bbox)
   * @param{string} prefix      The directory where the locales are located
   * @param{string[]} locales   The list of localizations for this component (e.g., ['en', 'fr', 'de'])
   */
  public static registerLocaleFiles(component: string, prefix: string, locales: string[]) {
    if (this.isComponent) {
      prefix = component;
    }
    for (const locale of locales) {
      if (!this.files[locale]) {
        this.files[locale] = [];
      }
      this.files[locale].push({component, file: `${prefix}/locales/${locale}.json`});
    }
  }

  /**
   * Register a set of messages for a given component and locale (called when the localization
   * files are loaded).
   *
   * @param{string} component   The component's name (e.g., [tex]/bbox)
   * @param{string} locale      The locale for the messages
   * @param{messageData} data   The messages indexed byu their IDs
   */
  public static registerMessages(component: string, locale: string, data: messageData) {
    if (!this.data[component]) {
      this.data[component] = {};
    }
    const cdata = this.data[component];
    if (!cdata[locale]) {
      cdata[locale] = {};
    }
    Object.assign(cdata[locale], data);
  }

  /**
   * Get a message string and insert any arguments.  The arguments can be positional, or a
   * mapping of names to values.  E.g.
   *
   *    Locale.message('[my]/test', 'Hello', 'Hello %{name}!', {name: 'World'}));
   *    Locale.message('[my]/test', 'FooBar', '%1 bar', 'Foo'));
   *
   * @param{string} component       The component whose message is requested
   * @param{string} id              The id of the message
   * @param{string} message         The English message for in case the localized version is missing
   * @param{string|namedDat} data   The first argument or the object of names arguments
   * @param{srting[]} ...args       Any additional string arguments (if data is a string)
   * @return{string}                The localized message with arguments substituted in
   */
  public static message(
    component: string,
    id: string,
    message: string,
    data: string | namedData = {},
    ...args: string[]
  ): string {
    message = this.lookupMessage(component, id, message);
    if (typeof data === 'string') {
      data = {1: data};
      for (let i = 0; i < args.length; i++) {
        data[i + 2] = args[i];
      }
    }
    data['%'] ='%';
    return this.substituteArguments(message, data);
  }

  /**
   * Find a localized message string, or use the default if not available
   *
   * @param{string} component   The component for this message
   * @param{string} id          The id of the message
   * @param{string} message     The default message for if a localized one is not available
   * @return{string}            The message string to use
   */
  public static lookupMessage(component: string, id: string, message: string): string {
    return this.data[component]?.[this.current]?.[id] || message;
  }

  /**
   * Substitue arguments into a message string
   *
   * @param{string} message   The original message string
   * @param{namedData} data   The mapping of markers to values
   * @return{string}          The final string with substitutions made
   */
  protected static substituteArguments(message: string, data: namedData): string {
    const parts = message.split(/%(%|\d+|[a-z]+|\{.*?\})/);
    for (let i = 1; i < parts.length; i += 2) {
      const id = parts[i].replace(/^\{(.*)\}$/, '$1');
      parts[i] = data[id] || '';
    }
    return parts.join('');
  }

  /**
   * Throw an error with a given string substituting the given parameters
   *
   * @param{string} component       The component whose message is requested
   * @param{string} id              The id of the message
   * @param{string} message         The English message for in case the localized version is missing
   * @param{string|namedDat} data   The first argument or the object of names arguments
   * @param{srting[]} ...args       Any additional string arguments (if data is a string)
   */
  public static error(
    component: string,
    id: string,
    message: string,
    data: string | namedData,
    ...args: string[]
  ) {
    throw Error(this.message(component, id, message, data, ...args));
  }

  /**
   * Set the locale to the given one (or use the current one), and load
   * any needed files (or newly registered files for the current locale).
   *
   * @param{string} locale    The local to use (or use the current one)
   * @return{Promise<void>}   A promise that resolves when the locale files have been loaded
   */
  public static async setLocale(locale: string = this.current): Promise<void[]> {
    const files = this.files[locale];
    if (!files) {
      this.error('core', 'UnknownLocale', 'Local "%1" is not defined', locale);
    }
    const promises = [];
    while (files.length) {
      const {component, file} = files.shift();
      promises.push(this.getLocaleData(component, this.current, file));
    }
    return Promise.all(promises);
  }

  /**
   * Load a localization file and register its contents
   *
   * @param{string} component   The component whose localization is being loaded
   * @param{string} locale      The locale being loaded
   * @param{string} file        The file to load for that localization
   * @return{Promise<void>}     A promise that resolves when the file is loaded and registered
   */
  protected static async getLocaleData(component: string, locale: string, file: string): Promise<void> {
    return asyncLoad(file).then((data: messageData) => this.registerMessages(component, locale, data));
  }

}
