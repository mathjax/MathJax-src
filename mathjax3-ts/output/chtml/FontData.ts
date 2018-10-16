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

export type CharOptionsMap = {[name: number]: CharOptions};
export type CssMap = {[name: number]: number};

/**
 * @param {CharMap} font             The font to augment
 * @param {CssMap} css               The css data value to use for each character
 * @param {CharOptionsMap} options   Any additional options for characters in the font
 * @return {CharMap}                 The augmented font
 */
export function AddCSS(font: CharMap, css: CssMap, options: CharOptionsMap) {
    for (const c of Object.keys(css)) {
        const n = parseInt(c);
        FontData.charOptions(font, n).css = css[n];
    }
    for (const c of Object.keys(options)) {
        const n = parseInt(c);
        Object.assign(FontData.charOptions(font, n), options[n]);
    }
    return font;
}
