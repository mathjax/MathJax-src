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
 * @fileoverview  Implements the ChtmlFontData class and AddCSS() function.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CharMap, CharOptions, CharDataArray, VariantData,
        DelimiterData, FontData, FontExtensionData, DIRECTION} from '../common/FontData.js';
import {Usage} from './Usage.js';
import {StringMap} from './Wrapper.js';
import {StyleList, StyleData} from '../../util/StyleList.js';
import {em} from '../../util/lengths.js';

export * from '../common/FontData.js';

/****************************************************************************/

/**
 * Add the extra data needed for CharOptions in CHTML
 */
export interface ChtmlCharOptions extends CharOptions {
  c?: string;                   // the content value (for css)
  f?: string;                   // the font postfix (for css)
  ff?: string;                  // the full font css class (for extensions)
  cmb?: boolean;                // true if this is a combining character
}

/**
 * Shorthands for CHTML char maps and char data
 */
export type ChtmlCharMap = CharMap<ChtmlCharOptions>;
export type ChtmlCharData = CharDataArray<ChtmlCharOptions>;

/**
 * The extra data needed for a Variant in CHTML output
 */
export interface ChtmlVariantData extends VariantData<ChtmlCharOptions> {
  letter: string;               // the font letter(s) for the default font for this variant
}

/**
 * The extra data needed for a Delimiter in CHTML output
 */
export interface ChtmlDelimiterData extends DelimiterData {
}

/**
 * Includes the data needed for CHTML font extensions
 */
export interface ChtmlFontExtensionData<C extends ChtmlCharOptions, D extends ChtmlDelimiterData>
extends FontExtensionData<C, D> {
  fonts?: string[];   // the font names to add to the CSS
  fontURL?: string;   // the URL for the WOFF files
}

/****************************************************************************/

/**
 * The CHTML FontData class
 */
export class ChtmlFontData extends FontData<ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData> {

  /**
   * Default options
   */
  public static OPTIONS = {
    ...FontData.OPTIONS,
    dynamicPrefix: './output/chtml/fonts',
    fontURL: 'js/output/chtml/fonts/woff'
  };

  /**
   * @override
   */
  public static JAX = 'CHTML';

  /**
   * The default font letter to use for each variant
   */
  protected static defaultVariantLetters: StringMap = {};

  /**
   * The CSS styles needed for this font.
   */
  protected static defaultStyles = {};

  /**
   * The default @font-face declarations with %%URL%% where the font path should go
   */
  protected static defaultFonts = {};

  /**
   * The combining character ranges
   */
  protected static combiningChars: [number, number][] = [
    [0x300, 0x36F] , [0x20D0, 0x20FF]
  ];

  /***********************************************************************/

  /**
   * Data about the characters used (for adaptive CSS)
   */
  public charUsage: Usage<[string, number]> = new Usage<[string, number]>();

  /**
   * Data about the delimiters used (for adpative CSS)
   */
  public delimUsage: Usage<number> = new Usage<number>();

  /**
   * New styles since last update
   */
  public fontUsage: StyleList = {};

  /**
   * Number of new @font-face entries that have been processed
   */
  protected newFonts: number = 0;

  /***********************************************************************/

  /**
   * @override
   */
  public static charOptions(font: ChtmlCharMap, n: number) {
    return super.charOptions(font, n) as ChtmlCharOptions;
  }

  /**
   * @param {StyleList} styles    The style object to add styles to
   * @param {StyleList} fonts     The default font-face directives with %%URL%% where the url should go
   * @param {string} url          The actual URL to insert into the src strings
   */
  public static addFontURLs(styles: StyleList, fonts: StyleList, url: string) {
    for (const name of Object.keys(fonts)) {
      const font = {...fonts[name]};
      font.src = (font.src as string).replace(/%%URL%%/, url);
      styles[name] = font;
    }
  }

  /**
   * @param {StyleList} styles   The style object to add styles to
   * @param {string[]} fonts     The IDs for the fonts to add CSS for
   * @param {string} root        The root URL for the fonts (can be set by extensions)
   */
  public static addDynamicFontCss(styles: StyleList, fonts: string[], root: string) {
    const fontStyles: StyleList = {};
    for (const font of fonts) {
      const name = font.slice(4);
      fontStyles[`@font-face /* ${name} */`] = {
        'font-family': font,
        src: `url("%%URL%%/${font.toLowerCase()}.woff") format("woff")`,
      };
      styles[`.${name}`] = {
        'font-family': `${this.defaultCssFamilyPrefix}, ${font}`
      };
    }
    this.addFontURLs(styles, fontStyles, root);
  }

  /**
   * @override
   */
  public static addExtension(
    data: ChtmlFontExtensionData<ChtmlCharOptions, ChtmlDelimiterData>,
    prefix: string = ''
  ) {
    super.addExtension(data, prefix);
    data.fonts && this.addDynamicFontCss(this.defaultStyles, data.fonts, data.fontURL);
  }

  /***********************************************************************/

  /**
   * @param {boolean} adapt   Whether to use adaptive CSS or not
   */
  public adaptiveCSS(adapt: boolean) {
    this.options.adaptiveCSS = adapt;
  }

  /**
   * Clear the cache of which characters have been used
   */
  public clearCache() {
    if (this.options.adaptiveCSS) {
      this.charUsage.clear();
      this.delimUsage.clear();
    }
  }

  /**
   * @override
   */
  public createVariant(name: string, inherit: string = null, link: string = null) {
    super.createVariant(name, inherit, link);
    this.variant[name].letter = (this.constructor as ChtmlFontDataClass).defaultVariantLetters[name];
  }

  /**
   * @override
   */
  public defineChars(name: string, chars: ChtmlCharMap) {
    super.defineChars(name, chars);
    const letter = this.variant[name].letter;
    const CLASS = this.constructor as typeof ChtmlFontData;
    for (const n of Object.keys(chars)) {
      const i = parseInt(n);
      if (!Array.isArray(chars[i])) continue;
      const options = CLASS.charOptions(chars, i);
      if (options.f === undefined) {
        options.f = letter;
      }
      for (const [m, M] of CLASS.combiningChars) {
        if (i >= m && i <= M) {
          options.cmb = true;
          break;
        }
      }
    }
  }

  /**
   * @override
   */
  public addDynamicFontCss(fonts: string[], root: string = this.options.fontURL) {
    (this.constructor as typeof ChtmlFontData).addDynamicFontCss(this.fontUsage, fonts, root);
  }

  /**
   * Get the styles for dynamically loaded fonts since the last CSS update
   */
  public updateDynamicStyles() {
    const styles = this.fontUsage;
    this.fontUsage = {};
    !this.options.adaptiveCSS && this.updateStyles(styles);
    return styles;
  }

  /***********************************************************************/

  /**
   * @return {StyleList}  The (computed) styles for this font
   */
  get styles(): StyleList {
    const CLASS = this.constructor as typeof ChtmlFontData;
    //
    //  Include the default styles
    //
    const styles: StyleList = {...CLASS.defaultStyles, ...this.fontUsage};
    this.fontUsage = {};
    //
    //  Add fonts with proper URL
    CLASS.addFontURLs(styles, CLASS.defaultFonts, this.options.fontURL);
    //
    //  Add the styles for delimiters and characters
    //
    if (this.options.adaptiveCSS) {
      this.updateStyles(styles);
    } else {
      this.allStyles(styles);
    }
    //
    //  Return the final style sheet
    //
    return styles;
  }

  /**
   * Get the styles for any newly used characters and delimiters
   *
   * @param {StyleList} styles  The style list to add delimiter styles to.
   * @return {StyleList}        The modified style list.
   */
  public updateStyles(styles: StyleList): StyleList {
    for (const N of this.delimUsage.update()) {
      this.addDelimiterStyles(styles, N, this.getDelimiter(N));
    }
    for (const [name, N] of this.charUsage.update()) {
      const variant = this.variant[name];
      this.addCharStyles(styles, variant.letter, N, variant.chars[N] as ChtmlCharData);
    }
    return styles;
  }

  /**
   * @param {StyleList} styles  The style list to add characters to
   */
  protected allStyles(styles: StyleList) {
    //
    //  Create styles needed for the delimiters
    //
    for (const n of Object.keys(this.delimiters)) {
      const N = parseInt(n);
      this.addDelimiterStyles(styles, N, this.delimiters[N] as ChtmlDelimiterData);
    }
    //
    //  Add style for all character data
    //
    for (const name of Object.keys(this.variant)) {
      const variant = this.variant[name];
      const vletter = variant.letter;
      for (const n of Object.keys(variant.chars)) {
        const N = parseInt(n);
        const char = variant.chars[N] as ChtmlCharData;
        if (char?.[3]?.smp || !Array.isArray(char)) continue;
        if (char.length < 4) {
          char[3] = {};
        }
        this.addCharStyles(styles, vletter, N, char);
      }
    }
  }

  /*******************************************************/

  /**
   * @param {StyleList} styles         The style object to add styles to
   * @param {number} n                 The unicode character number of the delimiter
   * @param {ChtmlDelimiterData} data  The data for the delimiter whose CSS is to be added
   */
  protected addDelimiterStyles(styles: StyleList, n: number, data: ChtmlDelimiterData) {
    if (!data.stretch) return;
    const c = (data.c && data.c !== n ? this.charSelector(data.c) : this.charSelector(n));
    if (data.dir === DIRECTION.Vertical) {
      this.addDelimiterVStyles(styles, n, c, data);
    } else {
      this.addDelimiterHStyles(styles, n, c, data);
    }
  }

  /*******************************************************/

  /**
   * @param {StyleList} styles         The style object to add styles to
   * @param {number} n                 The delimiter unicode number
   * @param {string} c                 The delimiter character string
   * @param {ChtmlDelimiterData} data  The data for the delimiter whose CSS is to be added
   */
  protected addDelimiterVStyles(styles: StyleList, n: number, c: string, data: ChtmlDelimiterData) {
    const HDW = data.HDW as ChtmlCharData;
    const [beg, ext, end, mid] = data.stretch;
    const [begV, extV, endV, midV] = this.getStretchVariants(n);
    const Hb = this.addDelimiterVPart(styles, c, 'beg', beg, begV, HDW);
    this.addDelimiterVPart(styles, c, 'ext', ext, extV, HDW);
    const He = this.addDelimiterVPart(styles, c, 'end', end, endV, HDW);
    const css: StyleData = {};
    if (mid) {
      const Hm = this.addDelimiterVPart(styles, c, 'mid', mid, midV, HDW);
      css.height = '50%';
      styles['mjx-stretchy-v' + c + ' > mjx-mid'] = {
        'margin-top': this.em(-Hm / 2),
        'margin-bottom': this.em(-Hm / 2)
      };
    }
    if (Hb) {
      css['border-top-width'] = this.em0(Hb - .03);
    }
    if (He) {
      css['border-bottom-width'] = this.em0(He - .03);
      styles['mjx-stretchy-v' + c + ' > mjx-end'] = {'margin-top': this.em(-He)};
    }
    if (Object.keys(css).length) {
      styles['mjx-stretchy-v' + c + ' > mjx-ext'] = css;
    }
  }

  /**
   * @param {StyleList} styles  The style object to add styles to
   * @param {string} c          The vertical character whose part is being added
   * @param {string} part       The name of the part (beg, ext, end, mid) that is being added
   * @param {number} n          The unicode character to use for the part
   * @param {string} v          The variant for the character
   * @param {number} HDW        The height-depth-width data for the stretchy delimiter
   * @return {number}           The total height of the character
   */
  protected addDelimiterVPart(
    styles: StyleList, c: string, part: string, n: number,
    v: string, HDW: ChtmlCharData
  ): number {
    if (!n) return 0;
    const data = this.getChar(v, n);
    const dw = (HDW[2] - data[2]) / 2;
    const css: StyleData = {};
    if (part !== 'ext') {
      css.padding = this.padding(data, dw);
    } else {
      css.width = this.em0(HDW[2]);
      if (dw) {
        css['padding-left'] = this.em0(dw);
      }
    }
    styles['mjx-stretchy-v' + c + ' mjx-' + part + ' mjx-c'] = css;
    return data[0] + data[1];
  }

  /*******************************************************/

  /**
   * @param {StyleList} styles         The style object to add styles to
   * @param {number} n                 The delimiter unicode number
   * @param {string} c                 The delimiter character string
   * @param {ChtmlDelimiterData} data  The data for the delimiter whose CSS is to be added
   */
  protected addDelimiterHStyles(styles: StyleList, n: number, c: string, data: ChtmlDelimiterData) {
    const [beg, ext, end, mid] = data.stretch;
    const [begV, extV, endV, midV] = this.getStretchVariants(n);
    const HDW = data.HDW as ChtmlCharData;
    this.addDelimiterHPart(styles, c, 'beg', beg, begV, HDW);
    this.addDelimiterHPart(styles, c, 'ext', ext, extV, HDW);
    this.addDelimiterHPart(styles, c, 'end', end, endV, HDW);
    if (mid) {
      this.addDelimiterHPart(styles, c, 'mid', mid, midV, HDW);
      styles['mjx-stretchy-h' + c + ' > mjx-ext'] = {width: '50%'};
    }
  }

  /**
   * @param {StyleList} styles  The style object to add styles to
   * @param {string} c          The vertical character whose part is being added
   * @param {string} part       The name of the part (beg, ext, end, mid) that is being added
   * @param {number} n          The unicode character to use for the part
   * @param {string} v          The variant for the character
   * @param {ChtmlCharData} HDW The height-depth-width data for the stretchy character
   */
  protected addDelimiterHPart(styles: StyleList, c: string, part: string, n: number, v: string, HDW: ChtmlCharData) {
    if (!n) return;
    const w = this.getChar(v, n)[2];
    const css: StyleData = {padding: this.padding(HDW as ChtmlCharData, 0, w - HDW[2])};
    styles['mjx-stretchy-h' + c + ' mjx-' + part + ' mjx-c'] = css;
  }

  /*******************************************************/

  /**
   * @param {StyleList} styles     The style object to add styles to
   * @param {string} vletter       The variant class letter (e.g., `B`, `SS`) where this character is being defined
   * @param {number} n             The unicode character being defined
   * @param {ChtmlCharData} data   The bounding box data and options for the character
   */
  protected addCharStyles(styles: StyleList, vletter: string, n: number, data: ChtmlCharData) {
    const options = data[3] as ChtmlCharOptions;
    const letter = (options.f !== undefined ? options.f : vletter);
    const font = options.ff || (letter ? `${this.cssFontPrefix}-${letter}` : '');
    const selector = 'mjx-c' + this.charSelector(n) + (font ? '.' + font : '');
    const def = styles[selector] = {padding: this.padding(data, 0, options.ic || 0)} as StyleData;
    if (options.cmb) {
      //
      //  Some browsers now handle combining characters as 0-width even when they aren't, so
      //  we adjust the CSS to handle both automatic 0-width as well as non-zero width characters.
      //
      const pad = (def.padding as string).split(/ /);
      def.width = pad[1];
      pad[1] = '0px';
      def.padding = pad.join(' ');
      def['text-align'] = 'right';
    }
  }

  /***********************************************************************/

  /**
   * @param {number} n  The number of ems
   * @return {string}   The string representing the number with units of "em"
   */
  public em(n: number): string {
    return em(n);
  }

  /**
   * @param {number} n  The number of ems (will be restricted to non-negative values)
   * @return {string}   The string representing the number with units of "em"
   */
  public em0(n: number): string {
    return em(Math.max(0, n));
  }

  /**
   * @param {ChtmlCharData} data   The [h, d, w] data for the character
   * @param {number} dw            The (optional) left offset of the glyph
   * @param {number} ic            The (optional) italic correction value
   * @return {string}              The padding string for the h, d, w.
   */
  public padding([h, d, w]: ChtmlCharData, dw: number = 0, ic: number = 0): string {
    return [h, w + ic, d, dw].map(this.em0).join(' ');
  }

  /**
   * @param {number} n  A unicode code point to be converted to a selector for use with the
   *                    CSS rules for fonts
   * @return {string}   The character as a selector value.
   */
  public charSelector(n: number): string {
    return '.mjx-c' + n.toString(16).toUpperCase();
  }

}

/**
 * The ChtmlFontData constructor class
 */
export type ChtmlFontDataClass = typeof ChtmlFontData;

/****************************************************************************/

/**
 * Data needed for AddCSS()
 */
export type CharOptionsMap = {[name: number]: ChtmlCharOptions};
export type CssMap = {[name: number]: number};

/**
 * @param {ChtmlCharMap} font        The font to augment
 * @param {CharOptionsMap} options   Any additional options for characters in the font
 * @return {ChtmlCharMap}            The augmented font
 */
export function AddCSS(font: ChtmlCharMap, options: CharOptionsMap): ChtmlCharMap {
  for (const c of Object.keys(options)) {
    const n = parseInt(c);
    const data = options[n];
    if (data.c) {
      data.c = data.c.replace(/\\[0-9A-F]+/ig,
                              (x) => String.fromCodePoint(parseInt(x.substr(1), 16)));
    }
    Object.assign(FontData.charOptions(font, n), data);
  }
  return font;
}
