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

import {StringMap} from './Wrapper.js';

/*
 * The extra options allowed in a CharData array
 */
export type CharOptions = {
    c?: string;                   // the content value (for css)
    f?: string;                   // the font postfix (for css)
    css?: number;                 // a bitmap for whether CSS is needed for content, padding, or width
    ic?: number;                  // italic correction value
    sk?: number;                  // skew value
};

/*
 * The bit values for CharOptions.css
 */
export const enum CSS {
    width = 1 << 0,
    padding = 1 << 1,
    content = 1 << 2
}


/*
 * Data about a character
 *   [height, depth, width, italic-correction, skew, options]
 */
export type CharData =
    [number, number, number] |
    [number, number, number, CharOptions];

export type CharMap = {
    [n: number]: CharData;
};

export type CharMapMap = {
    [name: string]: CharMap;
};

/*
 * Data for a variant
 */
export type VariantData = {
    /*
     * A list of CharMaps that must be updated when characters are
     * added to this variant
     */
    linked: CharMap[];
    /*
     * The character data for this variant
     */
    chars: CharMap;
    /*
     * The classes to use for this variant
     */
    classes?: string;
};

export type VariantMap = {
    [name: string]: VariantData;
};

/*
 * Stretchy delimiter data
 */
export type DelimiterData = {
    dir: string;                 // 'V' or 'H' for vertcial or horizontal
    sizes?: number[];            // Array of fixed sizes for this character
    variants?: number[];         // The variants in which the different sizes can be found (if not the default)
    schar?: number[];            // The character number to use for each size (if different from the default)
    stretch?: number[];          // The unicode character numbers for the parts of multi-character versions [beg, ext, end, mid?]
    HDW?: number[];              // [h, d, w] (for vertical, h and d are the normal size, w is the multi-character width,
                                 //            for horizontal, h and d are the multi-character ones, w is for the normal size).
    min?: number;                // The minimum size a multi-character version can be
    c?: number;                   // The character number (for aliased delimiters)
};

export type DelimiterMap = {
    [n: number]: DelimiterData;
};

/*
 * Font parameters (for TeX typesetting rules)
 */
export type FontParameters = {
    x_height: number,
    quad: number,
    num1: number,
    num2: number,
    num3: number,
    denom1: number,
    denom2: number,
    sup1: number,
    sup2: number,
    sup3: number,
    sub1: number,
    sub2: number,
    sup_drop: number,
    sub_drop: number,
    delim1: number,
    delim2: number,
    axis_height: number,
    rule_thickness: number,
    big_op_spacing1: number,
    big_op_spacing2: number,
    big_op_spacing3: number,
    big_op_spacing4: number,
    big_op_spacing5: number,

    surd_height: number,

    scriptspace: number,
    nulldelimiterspace: number,
    delimiterfactor: number,
    delimitershortfall: number,

    min_rule_thickness: number
};

/*
 * The stretch direction
 */
export const V = 'V';
export const H = 'H';

/****************************************************************************/
/*
 *  The FontData class (for storing character bounding box data by variant,
 *                      and the stretchy delimiter data).
 */
export class FontData {

    /*
     *  The standard variants to define
     */
    protected static defaultVariants = [
        ['normal'],
        ['bold', 'normal'],
        ['italic', 'normal'],
        ['bold-italic', 'italic', 'bold'],
        ['double-struck', 'bold'],
        ['fraktur', 'normal'],
        ['bold-fraktur', 'bold', 'fraktur'],
        ['script', 'normal'],
        ['bold-script', 'bold', 'script'],
        ['sans-serif', 'normal'],
        ['bold-sans-serif', 'bold', 'sans-serif'],
        ['sans-serif-italic', 'italic', 'sans-serif'],
        ['bold-sans-serif-italic', 'bold-italic', 'sans-serif'],
        ['monospace', 'normal']
    ];

    /*
     *  The default font parameters for the font
     */
    public static defaultParams: FontParameters = {
        x_height:         .442,
        quad:             1,
        num1:             .676,
        num2:             .394,
        num3:             .444,
        denom1:           .686,
        denom2:           .345,
        sup1:             .413,
        sup2:             .363,
        sup3:             .289,
        sub1:             .15,
        sub2:             .247,
        sup_drop:         .386,
        sub_drop:         .05,
        delim1:          2.39,
        delim2:          1.0,
        axis_height:      .25,
        rule_thickness:   .06,
        big_op_spacing1:  .111,
        big_op_spacing2:  .167,
        big_op_spacing3:  .2,
        big_op_spacing4:  .45, // .6,  // better spacing for under arrows and braces
        big_op_spacing5:  .1,

        surd_height:      .075,

        scriptspace:         .05,
        nulldelimiterspace:  .12,
        delimiterfactor:     901,
        delimitershortfall:   .3,

        min_rule_thickness:  1.25     // in pixels
    };

    /*
     * The default delimiter and character data
     */
    protected static defaultDelimiters: DelimiterMap = {};
    protected static defaultChars: CharMapMap = {};

    /*
     * The default variants for the fixed size stretchy delimiters
     */
    protected static defaultSizeVariants: string[] = [];

    /*
     * The default class names to use for each variant
     */
    protected static defaultVariantClasses: StringMap = {};

    /*
     * The actual variant, delimiter, and size information for this font
     */
    protected variant: VariantMap = {};
    protected delimiters: DelimiterMap = {};
    protected sizeVariants: string[];

    /*
     * The actual font parameters for this font
     */
    public params: FontParameters;

    /*
     * Copies the data from the defaults to the instance
     *
     * @constructor
     */
    constructor() {
        let CLASS = (this.constructor as typeof FontData);
        this.params = {...CLASS.defaultParams};
        this.sizeVariants = CLASS.defaultSizeVariants.slice(0);
        this.createVariants(CLASS.defaultVariants);
        this.defineDelimiters(CLASS.defaultDelimiters);
        for (const name of Object.keys(CLASS.defaultChars)) {
            this.defineChars(name, CLASS.defaultChars[name]);
        }
        for (const name of Object.keys(CLASS.defaultVariantClasses)) {
            this.variant[name].classes = CLASS.defaultVariantClasses[name];
        }
    }

    /*
     * Creates the data structure for a variant -- an object with
     *   prototype chain that includes a copy of the linked variant,
     *   and then the inherited variant chain.
     *
     *   The reason for this extra link is that for a mathvariant like
     *   bold-italic, you want to inherit from both the bold and
     *   italic variants, but the prototype chain can only inherit
     *   from one. So for bold-italic, we make an object that has a
     *   prototype consisting of a copy of the bold data, and add the
     *   italic data as the prototype chain. (Since this is a copy, we
     *   keep a record of this link so that if bold is changed later,
     *   we can update this copy. That is not needed for the prototype
     *   chain, since the prototypes are the actual objects, not
     *   copies.) We then use this bold-plus-italic object as the
     *   prototype chain for the bold-italic object
     *
     *   That means that bold-italic will first look in its own object
     *   for specifically bold-italic glyphs that are defined there,
     *   then in the copy of the bold glyphs (only its top level is
     *   copied, not its prototype chain), and then the specifically
     *   italic glyphs, and then the prototype chain for italics,
     *   which is the normal glyphs. Effectively, this means
     *   bold-italic looks for bold-italic, then bold, then italic,
     *   then normal glyphs in order to find the given character.
     *
     * @param{string} name     The new variant to create
     * @param{string} inherit  The variant to use if a character is not in this one
     * @param{string} link     A variant to search before the inherit one (but only
     *                           its top-level object).
     */
    public createVariant(name: string, inherit: string = null, link: string = null) {
        let variant = {
            linked: [] as CharMap[],
            chars: (inherit ? Object.create(this.variant[inherit].chars) : {}) as CharMap
        };
        if (link && this.variant[link]) {
            Object.assign(variant.chars, this.variant[link].chars);
            this.variant[link].linked.push(variant.chars);
            variant.chars = Object.create(variant.chars);
        }
        this.variant[name] = variant;
    }

    /*
     * Create a collection of variants
     *
     * @param{string[][]} variants  Array of [name, inherit?, link?] values for
     *                              the variants to define
     */
    public createVariants(variants: string[][]) {
        for (const variant of variants) {
            this.createVariant(variant[0], variant[1], variant[2]);
        }
    }

    /*
     * Defines new character data in a given variant
     *  (We use Object.assign() here rather than the spread operator since
     *  the character maps are objeccts with prototypes, and we don't
     *  want to loose those by doing {...chars} or something similar.)
     *
     * @param{string} name    The variant for these characters
     * @param{CharMap} chars  The characters to define
     */
    public defineChars(name: string, chars: CharMap) {
        let variant = this.variant[name];
        Object.assign(variant.chars, chars);
        for (const link of variant.linked) {
            Object.assign(link, chars);
        }
    }

    /*
     * Defines strety delimiters
     *
     * @param{DelimiterMap} delims  The delimiters to define
     */
    public defineDelimiters(delims: DelimiterMap) {
        Object.assign(this.delimiters, delims);
    }

    /*
     * @param{number} n  The delimiter character number whose data is desired
     * @return{DelimiterData}  The data for that delimiter (or undefined)
     */
    public getDelimiter(n: number) {
        return this.delimiters[n];
    }

    /*
     * @param{number} n  The delimiter character number whose variant is needed
     * @param{number} i  The index in the size array of the size whose variant is needed
     * @return{string}   The variant of the i-th size for delimiter n
     */
    public getSizeVariant(n: number, i: number) {
        if (this.delimiters[n].variants) {
            i = this.delimiters[n].variants[i];
        }
        return this.sizeVariants[i];
    }

    /*
     * @param{string} name  The variant whose character data is being querried
     * @param{number} n     The unicode number for the character to be found
     * @return{CharData}    The data for the given character (or undefined)
     */
    public getChar(name: string, n: number) {
        return this.variant[name].chars[n];
    }

    /*
     * @param{string} name   The name of the variant whose data is to be obtained
     * @return{VariantData}  The data for the requested variant (or undefined)
     */
    public getVariant(name: string) {
        return this.variant[name];
    }

    /*
     * @param{number} n  A unicode code point to be converred to a character reference for use with the
     *                   CSS rules for fonts (either a literal character for most ASCII values, or \nnnn
     *                   for higher values, or for the double quote and backslash characters).
     * @return{string}  The character as a properly encoded string.
     */
    public char(n: number, escape: boolean = false) {
        return (n >= 0x20 && n <= 0x7E && n !== 0x22 && n !== 0x27 && n !== 0x5C ?
                String.fromCharCode(n) : (escape ? '\\' : '') + n.toString(16).toUpperCase());
    }

}
