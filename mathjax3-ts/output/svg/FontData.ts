/*************************************************************
 *
 *  Copyright (c) 2017 The MathJax Consortium
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
 * @fileoverview  Implements the FontData class for character bbox data
 *                and stretchy delimiters.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CharMap, CharOptions, FontData} from '../common/FontData.js';
export * from '../common/FontData.js';

export type CharStringMap = {[name: number]: string};

/**
 * @param {CharMap} font        The font to augment
 * @param {StringMap} paths     The path data to use for each character
 * @param {StringMap} content   The string to use for remapped characters
 * @return {CharMap}            The augmented font
 */
export function AddPaths(font: CharMap, paths: CharStringMap, content: CharStringMap) {
    for (const c of Object.keys(paths)) {
        const n = parseInt(c);
        FontData.charOptions(font, n).p = paths[n];
    }
    for (const c of Object.keys(content)) {
        const n = parseInt(c);
        FontData.charOptions(font, n).c = content[n];
    }
    return font;
}
