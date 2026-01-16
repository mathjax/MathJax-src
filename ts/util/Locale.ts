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
 * @file  Implements the locale framework
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { asyncLoad } from './AsyncLoad.js';

/**
 * The various object map types
 */
export type messageData = { [id: string]: string };
export type localeData = { [locale: string]: messageData };
export type componentData = { [component: string]: localeData };
export type namedData = { [name: string | number]: string };

/**
 * The Locale class for handling localized messages
 */
export class Locale {
  /**
   * The current locale
   */
  public static current: string = 'en';

  /**
   * The default locale for when a message has no current localization
   */
  public static default: string = 'en';

  /**
   * True when the core component has been loaded (and so the Package path resolution is available)
   */
  public static isComponent: boolean = false;

  /**
   * The localized message strings, per component and locale,
   * with the default message for localeError() below.
   */
  protected static data: componentData = {
    locale: {
      en: {
        LocaleJsonError: "MathJax(%1): Can't load '%2': %3",
      },
    },
  };

  /**
   * The locale files to load for each locale (as registered by the components)
   */
  protected static locations: { [component: string]: [string, Set<string>] } =
    {};

  /**
   * Registers a given component's locale directory
   *
   * @param {string} component   The component's name (e.g., [tex]/bbox)
   * @param {string} prefix      The directory where the locales are located
   */
  public static registerLocaleFiles(
    component: string,
    prefix: string = component
  ) {
    this.locations[component] = [
      `${this.isComponent ? component : prefix}/locales`,
      new Set(),
    ];
  }

  /**
   * Register a set of messages for a given component and locale (called when the localization
   * files are loaded).
   *
   * @param {string} component   The component's name (e.g., [tex]/bbox)
   * @param {string} locale      The locale for the messages
   * @param {messageData} data   The messages indexed byu their IDs
   */
  public static registerMessages(
    component: string,
    locale: string,
    data: messageData
  ) {
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
   *    Locale.message('[my]/test', 'Hello', {name: 'World'}));
   *    Locale.message('[my]/test', 'FooBar', 'Foo'));
   *
   * @param {string} component        The component whose message is requested
   * @param {string} id               The id of the message
   * @param {string|namedData} data   The first argument or the object of names arguments
   * @param {string[]} args           Any additional string arguments (if data is a string)
   * @returns {string}                The localized message with arguments substituted in
   */
  public static message(
    component: string,
    id: string,
    data: string | namedData = {},
    ...args: string[]
  ): string {
    const message = this.lookupMessage(component, id);
    if (typeof data === 'string') {
      data = { 1: data };
      for (let i = 0; i < args.length; i++) {
        data[i + 2] = args[i];
      }
    }
    data['%'] = '%';
    return this.substituteArguments(message, data);
  }

  /**
   * Find a localized message string, or use the default if not available
   *
   * @param {string} component   The component for this message
   * @param {string} id          The id of the message
   * @returns {string}           The message string to use
   */
  public static lookupMessage(component: string, id: string): string {
    return (
      this.data[component]?.[this.current]?.[id] ||
      this.data[component]?.[this.default]?.[id] ||
      `No localized or default version for message with id '${id}' from '${component}'`
    );
  }

  /**
   * Substitue arguments into a message string
   *
   * @param {string} message   The original message string
   * @param {namedData} data   The mapping of markers to values
   * @returns {string}         The final string with substitutions made
   */
  protected static substituteArguments(
    message: string,
    data: namedData
  ): string {
    const parts = message.split(/%(%|\d+|[a-z]+|\{.*?\})/);
    for (let i = 1; i < parts.length; i += 2) {
      const id = parts[i].replace(/^\{(.*)\}$/, '$1');
      parts[i] = data[id] ?? '';
    }
    return parts.join('');
  }

  /**
   * Throw an error with a given string substituting the given parameters
   *
   * @param {string} component        The component whose message is requested
   * @param {string} id               The id of the message
   * @param {string|namedData} data   The first argument or the object of names arguments
   * @param {string[]} args           Any additional string arguments (if data is a string)
   */
  public static error(
    component: string,
    id: string,
    data: string | namedData,
    ...args: string[]
  ) {
    throw Error(this.message(component, id, data, ...args));
  }

  /**
   * Set the locale to the given one (or use the current one), and load
   * any needed files (or newly registered files for the current locale).
   *
   * @param {string} locale     The local to use (or use the current one)
   * @returns {Promise<void>}   A promise that resolves when the locale files have been loaded
   */
  public static async setLocale(
    locale: string = this.current
  ): Promise<void[]> {
    this.current = locale;
    const promises = [];
    for (const [component, [directory, loaded]] of Object.entries(
      this.locations
    )) {
      if (!loaded.has(locale)) {
        loaded.add(locale);
        promises.push(
          this.getLocaleData(component, locale, `${directory}/${locale}.json`)
        );
      }
    }
    return Promise.all(promises);
  }

  /**
   * Load a localization file and register its contents
   *
   * @param {string} component   The component whose localization is being loaded
   * @param {string} locale      The locale being loaded
   * @param {string} file        The file to load for that localization
   * @returns {Promise<void>}    A promise that resolves when the file is loaded and registered
   */
  protected static async getLocaleData(
    component: string,
    locale: string,
    file: string
  ): Promise<void> {
    return asyncLoad(file)
      .then((data: messageData) =>
        this.registerMessages(component, locale, data)
      )
      .catch((error) => this.localeError(component, locale, error));
  }

  /**
   * Report an error thrown when loading a component's locale file
   *
   * @param {string} component   The component whose localization is being loaded
   * @param {string} locale      The locale being loaded
   * @param {Error} error        The Error object causing the issue
   */
  protected static localeError(
    component: string,
    locale: string,
    error: Error
  ) {
    const message = this.message(
      'locale',
      'LocaleJsonError',
      component,
      `${locale}.json`,
      error.message
    );
    console.error(message);
  }
}
