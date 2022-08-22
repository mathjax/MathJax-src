/*************************************************************
 *
 *  Copyright (c) 2017-2022 The MathJax Consortium
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
 * @fileoverview  Implements functions needed by dynamic font files.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {ChtmlCharMap, ChtmlCharData} from './FontData.js';

/**
 * Used by dynamic font extensions to add font identifiers to ranges of characters in given variants
 */
export function AddFontIds(ranges: {[variant: string]: {[id: string]: ChtmlCharMap}}) {
  const data: {[variant: string]: ChtmlCharMap} = {};
  for (const id of Object.keys(ranges)) {
    const map = ranges[id];
    for (const variant of Object.keys(map)) {
      if (!data[variant]) {
        data[variant] = {};
      }
      const chars = map[variant];
      if (id) {
        for (const c of Object.keys(chars)) {
          const data = chars[parseInt(c)] as ChtmlCharData;
          if (!data[3]) {
            data[3] = {};
          }
          data[3].f = id;
        }
      }
      Object.assign(data[variant], chars);
    }
  }
  return data;
}
