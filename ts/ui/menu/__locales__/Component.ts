/*************************************************************
 *
 *  Copyright (c) 2026 The MathJax Consortium
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
 * @file  Locale component registration for ui/menu
 *
 * @author dpvc@mathjax.org (Davide P. Cervone
 */

import { Locale, namedData } from '../../../util/Locale.js';

export const COMPONENT = 'ui/menu';

Locale.registerLocaleFiles(COMPONENT, '../ts/ui/menu');

/**
 * Get a localized message for this component
 *
 * @param {string} id                   The id of the message
 * @param {(string|namedData)[]} args   The replacement arguments for the message, if any
 * @returns {string}                    The localized message
 */
export function localize(id: string, ...args: (string | namedData)[]): string {
  return Locale.message(COMPONENT, id, ...args);
}
