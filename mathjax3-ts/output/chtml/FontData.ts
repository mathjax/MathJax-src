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

import {CharMap, CharOptions, CharData, VariantData, DelimiterData, FontData, DIRECTION} from '../common/FontData.js';
import {StringMap} from './Wrapper.js';
import {StyleList, StyleData} from '../common/CssStyles.js';
import {em} from '../../util/lengths.js';
import {OptionList, defaultOptions, userOptions} from '../../util/Options.js';

export * from '../common/FontData.js';

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
     * Default options
     */
    public static OPTIONS = {
        fontURL: 'mathjax2/css/'
    };

    /**
     * The default class names to use for each variant
     */
    protected static defaultVariantClasses: StringMap = {};

    /**
     * The CSS styles needed for this font.
     */
    protected static defaultStyles = {};

    /**
     * The default @font-face declarations with %%URL%% where the font path should go
     */
    protected static defaultFonts = {
        '@font-face /* 0 */': {
            'font-family': 'MJXZERO',
            src: 'url("%%URL%%/otf/MathJax_Zero.otf") format("opentype")'
        }
    };

    /**
     * The font options
     */
    protected options: OptionList;

    /**
     * The root class for this font (e.g., '.MJX-TEX ') including the following space
     */
    protected cssRoot: string = '';

    /***********************************************************************/

    /**
     * @param {OptionList} options   The options for this font
     *
     * @override
     * @constructor
     */
    constructor(options: OptionList = null) {
        super();
        let CLASS = (this.constructor as CHTMLFontDataClass);
        this.options = userOptions(defaultOptions({}, CLASS.OPTIONS), options);
        for (const name of Object.keys(CLASS.defaultVariantClasses)) {
            this.variant[name].classes = CLASS.defaultVariantClasses[name];
        }
    }

    /***********************************************************************/

    /**
     * @return {StyleList}  The (computed) styles for this font
     *                     (could be used to limit styles to those actually used, for example)
     */
    get styles() {
        const CLASS = this.constructor as typeof CHTMLFontData;
        //
        //  Include the default styles
        //
        let styles: StyleList = {...CLASS.defaultStyles};
        //
        //  Add fonts with proper URL
        //
        this.addFontURLs(styles, CLASS.defaultFonts, this.options.fontURL);
        //
        //  Create styles needed for the delimiters
        //
        for (const n of Object.keys(this.delimiters)) {
            const N = parseInt(n);
            this.addDelimiterStyles(styles, N, this.delimiters[N]);
        }
        //
        //  Create styles needed for the characters in each variant
        //
        this.addVariantChars(styles);
        //
        //  Return the final style sheet
        //
        return styles;
    }

    /**
     * @param {StyleList} styles  The style list to add characters to
     */
    protected addVariantChars(styles: StyleList) {
        for (const name of Object.keys(this.variant)) {
            const variant = this.variant[name];
            const vclass = (name === 'normal' ? '' : '.' + variant.classes.replace(/ /g, '.'));
            for (const n of Object.keys(variant.chars)) {
                const N = parseInt(n);
                if (variant.chars[N].length === 4) {
                    this.addCharStyles(styles, vclass, N, variant.chars[N]);
                }
            }
        }
    }

    /**
     * @param {StyleList} styles    The style object to add styles to
     * @param {StyleList} fonts     The default font-face directives with %%URL%% where the url should go
     * @param {string} url          The actual URL to insert into the src strings
     */
    protected addFontURLs(styles: StyleList, fonts: StyleList, url: string) {
        for (const name of Object.keys(fonts)) {
            const font = {...fonts[name]};
            font.src = (font.src as string).replace(/%%URL%%/, url);
            styles[name] = font;
        }
    }

    /*******************************************************/

    /**
     * @param {StyleList} styles    The style object to add styles to
     * @param {number} n            The unicode character number of the delimiter
     * @param {DelimiterData} data  The data for the delimiter whose CSS is to be added
     */
    protected addDelimiterStyles(styles: StyleList, n: number, data: DelimiterData) {
        const c = this.char(n);
        if (data.c && data.c !== n) {
            styles[this.cssRoot + '.mjx-stretched mjx-c[c="' + c + '"]::before'] = {
                content: '"' + this.char(data.c, true) + '"'
            };
        }
        if (!data.stretch) return;
        if (data.dir === DIRECTION.Vertical) {
            this.addDelimiterVStyles(styles, c, data);
        } else {
            this.addDelimiterHStyles(styles, c, data);
        }
    }

    /*******************************************************/

    /**
     * @param {StyleList} styles    The style object to add styles to
     * @param {string} c            The delimiter character string
     * @param {DelimiterData} data  The data for the delimiter whose CSS is to be added
     */
    protected addDelimiterVStyles(styles: StyleList, c: string, data: DelimiterData) {
        const [beg, ext, end, mid] = data.stretch;
        const Hb = this.addDelimiterVPart(styles, c, 'beg', beg);
        this.addDelimiterVPart(styles, c, 'ext', ext);
        const He = this.addDelimiterVPart(styles, c, 'end', end);
        const css: StyleData = {};
        const root = this.cssRoot;
        if (mid) {
            const Hm = this.addDelimiterVPart(styles, c, 'mid', mid);
            css.height = '50%';
            styles[root + 'mjx-stretchy-v[c="' + c + '"] > mjx-mid'] = {
                'margin-top': this.em(-Hm/2),
                'margin-bottom': this.em(-Hm/2)
            };
        }
        if (Hb) {
            css['border-top-width'] = this.em0(Hb - .03);
        }
        if (He) {
            css['border-bottom-width'] = this.em0(He - .03);
            styles[root + 'mjx-stretchy-v[c="' + c + '"] > mjx-end'] = {'margin-top': this.em(-He)};
        }
        if (Object.keys(css).length) {
            styles[root + 'mjx-stretchy-v[c="' + c + '"] > mjx-ext'] = css;
        }
    }

    /**
     * @param {StyleList} styles  The style object to add styles to
     * @param {string} c          The vertical character whose part is being added
     * @param {string} part       The name of the part (beg, ext, end, mid) that is being added
     * @param {number} n          The unicode character to use for the part
     * @return {number}           The total height of the character
     */
    protected addDelimiterVPart(styles: StyleList, c: string, part: string, n: number) {
        if (!n) return 0;
        const data = this.getChar('normal', n) || this.getChar('-size4', n);
        const css: StyleData = {content: '"' + this.char(n, true) + '"'};
        if (part !== 'ext') {
            css.padding = this.em0(data[0]) + ' 0 ' + this.em0(data[1]);
        }
        styles[this.cssRoot + 'mjx-stretchy-v[c="' + c + '"] mjx-' + part + ' mjx-c::before'] = css;
        return data[0] + data[1];
    }

    /*******************************************************/

    /**
     * @param {StyleList} styles    The style object to add styles to
     * @param {string} c            The delimiter character string
     * @param {DelimiterData} data  The data for the delimiter whose CSS is to be added
     */
    protected addDelimiterHStyles(styles: StyleList, c: string, data: DelimiterData) {
        const [beg, ext, end, mid] = data.stretch;
        this.addDelimiterHPart(styles, c, 'beg', beg);
        this.addDelimiterHPart(styles, c, 'ext', ext, !(beg || end));
        this.addDelimiterHPart(styles, c, 'end', end);
        if (mid) {
            this.addDelimiterHPart(styles, c, 'mid', mid);
            styles[this.cssRoot + 'mjx-stretchy-h[c="' + c + '"] > mjx-ext'] = {width: '50%'};
        }
    }

    /**
     * @param {StyleList} styles  The style object to add styles to
     * @param {string} c          The vertical character whose part is being added
     * @param {string} part       The name of the part (beg, ext, end, mid) that is being added
     * @param {number} n          The unicode character to use for the part
     */
    protected addDelimiterHPart(styles: StyleList, c: string, part: string, n: number, force: boolean = false) {
        if (!n) {
            return 0;
        }
        const data = this.getChar('normal', n) || this.getChar('-size4', n);
        const options = data[3] as CHTMLCharOptions;
        const C = (options && options.c ? options.c : this.char(n, true));
        const css: StyleData = {content: '"' + C + '"'};
        if (part !== 'ext' || force) {
          css.padding = this.em0(data[0]) + ' 0 ' + this.em0(data[1]);
        }
        styles[this.cssRoot + 'mjx-stretchy-h[c="' + c + '"] mjx-' + part + ' mjx-c::before'] = css;
    }

    /*******************************************************/

    /**
     * @param {StyleList} styles  The style object to add styles to
     * @param {string} vclass     The variant class string (e.g., .mjx-b) where this character is being defined
     * @param {number} n          The unicode character being defined
     * @param {CharData} data     The bounding box data and options for the character
     */
    protected addCharStyles(styles: StyleList, vclass: string, n: number, data: CHTMLCharData) {
        const [h, d, w, options] = data as [number, number, number, CHTMLCharOptions];
        const css: StyleData = {};
        if (options.css) {
            if (options.css & CSS.width) {
                css.width = this.em(w);
            }
            if (options.css & CSS.padding) {
                css.padding = this.em0(h) + ' 0 ' + this.em0(d);
            }
            if (options.css & CSS.content) {
                css.content = '"' + (options.c || this.char(n, true)) + '"';
            }
        }
        if (options.f !== undefined) css['font-family'] = 'MJXZERO, MJXTEX' + (options.f ? '-' + options.f : '');
        const char = vclass + ' mjx-c[c="' + this.char(n) + '"]';
        const root = this.cssRoot;
        styles[root + char + '::before'] = css;
        if (options.ic) {
            const [MJX, noIC] = [root + 'mjx-', ':not([noIC="true"])' + char.substr(1) + ':last-child::before'];
            styles[MJX + 'mi' + noIC] =
            styles[MJX + 'mo' + noIC] = {
                width: this.em(w + options.ic)
            };
        }
    }

    /***********************************************************************/

    /**
     * @override
     */
    public static charOptions(font: CHTMLCharMap, n: number) {
        return super.charOptions(font, n) as CHTMLCharOptions;
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
