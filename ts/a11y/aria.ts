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
 * @file  Localizable ARIA constants.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { localize } from './__locales__/Component.js';

/**
 * Localization keys for ARIA role descriptions used by MathJax. Values are the
 * strings expected in the locale files.
 */
export const AriaRoleDescription: Record<string, string> = {
  EXPRESSION: 'Aria/RoleDescription/MathJax expression',
  MATHJAX: 'Aria/RoleDescription/MathJax',
  MATH: 'Aria/RoleDescription/math',
  CLICKABLE: 'Aria/RoleDescription/clickable math',
  EXPLORABLE: 'Aria/RoleDescription/explorable math',
  NONE: 'Aria/RoleDescription/none',
};

/**
 * Returns the localized string for a known ARIA role description ID.
 *
 * @param {string} id - The aria localization key to resolve.
 * @returns {string | null} Localized string or null if id has no Aria prefix.
 */
export function localizeAria(id: string): string {
  if (!hasAriaPrefix(id)) {
    return null;
  }
  return localize(id);
}

/**
 * Checks whether the given ID starts with the `Aria/` prefix.
 *
 * @param {string} id - The string to test.
 * @returns {boolean} True if `id` begins with `Aria/`.
 */
function hasAriaPrefix(id: string): boolean {
  return id.startsWith('Aria/');
}
