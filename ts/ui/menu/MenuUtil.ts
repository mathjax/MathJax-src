/*************************************************************
 *
 *  Copyright (c) 2024-2025 The MathJax Consortium
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
 * @file  Implements a function to handle copying to clipboard
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { context } from '../../util/context.js';

/**
 * True when platform is a Mac (so we can enable CMD menu item for zoom trigger)
 */
export const isMac = context.os === 'MacOS';

/**
 * @param {string} text   The text to be copied to the clipboard
 */
export function copyToClipboard(text: string) {
  const document = context.document;
  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.cssText =
    'height: 1px; width: 1px; padding: 1px; position: absolute; left: -10px';
  document.body.appendChild(input);
  input.select();
  try {
    document.execCommand('copy');
  } catch (error) {
    alert(`Can't copy to clipboard: ${error.message}`);
  }
  document.body.removeChild(input);
}
