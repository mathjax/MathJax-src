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
 * @fileoverview  Implements the CHTMLFontData class and AddCSS() function.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CharMap, CharOptions, CharData, VariantData, FontData} from '../common/FontData.js';
export * from '../common/FontData.js';
import {StringMap} from './Wrapper.js';
import {StyleList} from '../common/CssStyles.js';
import {em} from '../../util/lengths.js';

/****************************************************************************/

/**
 * Add the extra data needed for CharOptions in CHTML
 */
export interface CHTMLCharOptions extends CharOptions {
    c?: string;                   // the content value (for css)
    f?: string;                   // the font postfix (for css)
    css?: number;                 // a bitmap for whether CSS is needed for content, padding, or width
}

/**
 * Shorthands for CHTML char maps and char data
 */
export type CHTMLCharMap = CharMap<CHTMLCharOptions>;
export type CHTMLCharData = CharData<CHTMLCharOptions>;

/**
 * The extra data needed for a Variant in CHTML output
 */
export interface CHTMLVariantData extends VariantData<CHTMLCharOptions> {
    classes?: string;             // the classes to use for this variant
};

/**
 * The bit values for CharOptions.css
 */
export const enum CSS {
    width = 1 << 0,
    padding = 1 << 1,
    content = 1 << 2
}

/****************************************************************************/

/**
 * The CHTML FontData class
 */
export class CHTMLFontData extends FontData<CHTMLCharOptions, CHTMLVariantData> {
    /**
     * The default class names to use for each variant
     */
    protected static defaultVariantClasses: StringMap = {};

    /**
     * @override
     */
    public static charOptions(font: CHTMLCharMap, n: number) {
        return super.charOptions(font, n) as CHTMLCharOptions;
    }

    /**
     * @override
     * @constructor
     */
    constructor() {
        super();
        let CLASS = (this.constructor as CHTMLFontDataClass);
        for (const name of Object.keys(CLASS.defaultVariantClasses)) {
            this.variant[name].classes = CLASS.defaultVariantClasses[name];
        }
    }

    /**
     * @param {number} n  The number of ems
     * @return {string}   The string representing the number with units of "em"
     */
    public em(n: number) {
        return em(n);
    }

    /**
     * @param {number} n  The number of ems (will be restricted to non-negative values)
     * @return {string}   The string representing the number with units of "em"
     */
    public em0(n: number) {
        return em(Math.max(0, n));
    }

}

/**
 * The CHTMLFontData constructor class
 */
export type CHTMLFontDataClass = typeof CHTMLFontData;

/****************************************************************************/

/**
 * Data needed for AddCSS()
 */
export type CharOptionsMap = {[name: number]: CHTMLCharOptions};
export type CssMap = {[name: number]: number};

/**
 * @param {CHTMLCharMap} font        The font to augment
 * @param {CssMap} css               The css data value to use for each character
 * @param {CharOptionsMap} options   Any additional options for characters in the font
 * @return {CharMap}                 The augmented font
 */
export function AddCSS(font: CHTMLCharMap, css: CssMap, options: CharOptionsMap) {
    for (const c of Object.keys(css)) {
        const n = parseInt(c);
        CHTMLFontData.charOptions(font, n).css = css[n];
    }
    for (const c of Object.keys(options)) {
        const n = parseInt(c);
        Object.assign(FontData.charOptions(font, n), options[n]);
    }
    return font;
}
