/*************************************************************
 *
 *  Copyright (c) 2017-2025 The MathJax Consortium
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
 * @file  Implements functions needed by dynamic font files.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { ChtmlCharMap, ChtmlCharData } from './FontData.js';

/**
 * Used by dynamic font extensions to add font identifiers to ranges of characters in given variants
 *
 * @param {{[variant: string]: {[id: string]: ChtmlCharMap}}} ranges  The variant data to be added
 * @param {string?} prefix  The prefix for when this is used from a font extension
 * @returns {{ [variant: string]: ChtmlCharMap }} The variant map with integrated ranges
 */
export function AddFontIds(
  ranges: { [variant: string]: { [id: string]: ChtmlCharMap } },
  prefix?: string
): { [variant: string]: ChtmlCharMap } {
  const variants: { [variant: string]: ChtmlCharMap } = {};
  for (const id of Object.keys(ranges)) {
    const map = ranges[id];
    for (const variant of Object.keys(map)) {
      if (!variants[variant]) {
        variants[variant] = {};
      }
      const chars = map[variant];
      if (id) {
        for (const c of Object.keys(chars)) {
          const data = chars[parseInt(c)] as ChtmlCharData;
          if (!data[3]) {
            data[3] = {};
          }
          if (prefix) {
            data[3].ff = prefix + '-' + id;
          } else {
            data[3].f = id;
          }
        }
      }
      Object.assign(variants[variant], chars);
    }
  }
  return variants;
}
