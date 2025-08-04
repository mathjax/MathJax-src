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
 * @file  Implements the ChtmlFontData class and AddCSS() function.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {
  CharMap,
  CharOptions,
  CharDataArray,
  VariantData,
  DelimiterData,
  FontData,
  FontExtensionData,
  DIRECTION,
} from '../common/FontData.js';
import { Usage } from './Usage.js';
import { StringMap } from './Wrapper.js';
import {
  StyleJson,
  StyleJsonData,
  StyleJsonSheet,
} from '../../util/StyleJson.js';
import { em } from '../../util/lengths.js';

export * from '../common/FontData.js';

/****************************************************************************/

/**
 * Add the extra data needed for CharOptions in CHTML
 */
/* prettier-ignore */
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
  letter: string; // the font letter(s) for the default font for this variant
}

/**
 * The extra data needed for a Delimiter in CHTML output
 */
export interface ChtmlDelimiterData extends DelimiterData {}

/**
 * Includes the data needed for CHTML font extensions
 */
export interface ChtmlFontExtensionData<
  C extends ChtmlCharOptions,
  D extends ChtmlDelimiterData,
> extends FontExtensionData<C, D> {
  fonts?: string[]; // the font names to add to the CSS
  fontURL?: string; // the URL for the WOFF files
}

/****************************************************************************/

/**
 * The CHTML FontData class
 */
export class ChtmlFontData extends FontData<
  ChtmlCharOptions,
  ChtmlVariantData,
  ChtmlDelimiterData
> {
  /**
   * Default options
   */
  public static OPTIONS = {
    ...FontData.OPTIONS,
    dynamicPrefix: './chtml/dynamic',
    fontURL: './chtml/woff2',
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
    [0x300, 0x36f],
    [0x20d0, 0x20ff],
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
  public fontUsage: StyleJson = {};

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
   * @param {StyleJson} styles   The style object to add styles to
   * @param {StyleJson} fonts    The default font-face directives with %%URL%% where the url should go
   * @param {string} url         The actual URL to insert into the src strings
   */
  public static addFontURLs(styles: StyleJson, fonts: StyleJson, url: string) {
    for (const name of Object.keys(fonts)) {
      const font = { ...fonts[name] };
      font.src = (font.src as string).replace(/%%URL%%/, url);
      styles[name] = font;
    }
  }

  /**
   * @param {StyleJson} styles  The style object to add styles to
   * @param {string[]} fonts    The IDs for the fonts to add CSS for
   * @param {string} root       The root URL for the fonts (can be set by extensions)
   */
  public static addDynamicFontCss(
    styles: StyleJson,
    fonts: string[],
    root: string
  ) {
    const fontStyles: StyleJson = {};
    for (const font of fonts) {
      const name = font.slice(4);
      fontStyles[`@font-face /* ${name} */`] = {
        'font-family': font,
        src: `url("%%URL%%/${font.toLowerCase()}.woff2") format("woff2")`,
      };
      styles[`.${name}`] = {
        'font-family': `${this.defaultCssFamilyPrefix}, ${font}`,
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
    if (data.fonts) {
      this.addDynamicFontCss(this.defaultStyles, data.fonts, data.fontURL);
    }
  }

  /**
   * @override
   */
  public addExtension(
    data: ChtmlFontExtensionData<ChtmlCharOptions, ChtmlDelimiterData>,
    prefix: string = ''
  ): string[] {
    super.addExtension(data, prefix);
    if (!data.fonts || !this.options.adaptiveCSS) {
      return [];
    }
    const css = {};
    const styles = new StyleJsonSheet();
    (this.constructor as typeof ChtmlFontData).addDynamicFontCss(
      css,
      data.fonts,
      data.fontURL
    );
    styles.addStyles(css);
    return styles.getStyleRules();
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
  public createVariant(
    name: string,
    inherit: string = null,
    link: string = null
  ) {
    super.createVariant(name, inherit, link);
    this.variant[name].letter = (
      this.constructor as ChtmlFontDataClass
    ).defaultVariantLetters[name];
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
  public addDynamicFontCss(
    fonts: string[],
    root: string = this.options.fontURL
  ) {
    (this.constructor as typeof ChtmlFontData).addDynamicFontCss(
      this.fontUsage,
      fonts,
      root
    );
  }

  /**
   * Get the styles for dynamically loaded fonts since the last CSS update
   *
   * @returns {StyleJson} The updated style list
   */
  public updateDynamicStyles(): StyleJson {
    const styles = this.fontUsage;
    this.fontUsage = {};
    if (!this.options.adaptiveCSS) {
      this.updateStyles(styles);
    }
    return styles;
  }

  /***********************************************************************/

  /**
   * @returns {StyleJson}  The (computed) styles for this font
   */
  get styles(): StyleJson {
    const CLASS = this.constructor as typeof ChtmlFontData;
    //
    //  Include the default styles
    //
    const styles: StyleJson = { ...CLASS.defaultStyles, ...this.fontUsage };
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
   * @param {StyleJson} styles   The style list to add delimiter styles to.
   * @returns {StyleJson}        The modified style list.
   */
  public updateStyles(styles: StyleJson): StyleJson {
    for (const N of this.delimUsage.update()) {
      this.addDelimiterStyles(styles, N, this.getDelimiter(N));
    }
    for (const [name, N] of this.charUsage.update()) {
      const variant = this.variant[name];
      this.addCharStyles(
        styles,
        variant.letter,
        N,
        variant.chars[N] as ChtmlCharData
      );
    }
    return styles;
  }

  /**
   * @param {StyleJson} styles  The style list to add characters to
   */
  protected allStyles(styles: StyleJson) {
    //
    //  Create styles needed for the delimiters
    //
    for (const n of Object.keys(this.delimiters)) {
      const N = parseInt(n);
      this.addDelimiterStyles(
        styles,
        N,
        this.delimiters[N] as ChtmlDelimiterData
      );
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
   * @param {StyleJson} styles         The style object to add styles to
   * @param {number} n                 The unicode character number of the delimiter
   * @param {ChtmlDelimiterData} data  The data for the delimiter whose CSS is to be added
   */
  protected addDelimiterStyles(
    styles: StyleJson,
    n: number,
    data: ChtmlDelimiterData
  ) {
    if (!data.stretch) return;
    const c =
      data.c && data.c !== n ? this.charSelector(data.c) : this.charSelector(n);
    if (data.dir === DIRECTION.Vertical) {
      this.addDelimiterVStyles(styles, n, c, data);
    } else {
      this.addDelimiterHStyles(styles, n, c, data);
    }
  }

  /*******************************************************/

  /**
   * @param {StyleJson} styles         The style object to add styles to
   * @param {number} n                 The delimiter unicode number
   * @param {string} c                 The delimiter character string
   * @param {ChtmlDelimiterData} data  The data for the delimiter whose CSS is to be added
   */
  protected addDelimiterVStyles(
    styles: StyleJson,
    n: number,
    c: string,
    data: ChtmlDelimiterData
  ) {
    const HDW = data.HDW as ChtmlCharData;
    const [beg, ext, end, mid] = data.stretch;
    const [begV, extV, endV, midV] = this.getStretchVariants(n);
    const Hb = this.addDelimiterVPart(styles, c, 'beg', beg, begV, HDW);
    this.addDelimiterVPart(styles, c, 'ext', ext, extV, HDW);
    const He = this.addDelimiterVPart(styles, c, 'end', end, endV, HDW);
    if (mid) {
      const Hm = this.addDelimiterVPart(styles, c, 'mid', mid, midV, HDW);
      const m = this.em(Hm / 2 - 0.03);
      styles[`mjx-stretchy-v${c} > mjx-ext:first-of-type`] = {
        height: '50%',
        'border-width': `${this.em1(Hb - 0.03)} 0 ${m}`,
      };
      styles[`mjx-stretchy-v${c} > mjx-ext:last-of-type`] = {
        height: '50%',
        'border-width': `${m} 0 ${this.em1(He - 0.03)}`,
      };
    } else if (He || Hb) {
      styles[`mjx-stretchy-v${c} > mjx-ext`]['border-width'] =
        `${this.em1(Hb - 0.03)} 0 ${this.em1(He - 0.03)}`;
    }
  }

  /**
   * @param {StyleJson} styles     The style object to add styles to
   * @param {string} c             The vertical character whose part is being added
   * @param {string} part          The name of the part (beg, ext, end, mid) that is being added
   * @param {number} n             The unicode character to use for the part
   * @param {string} v             The variant for the character
   * @param {number} HDW           The height-depth-width data for the stretchy delimiter
   * @returns {number}             The total height of the character
   */
  protected addDelimiterVPart(
    styles: StyleJson,
    c: string,
    part: string,
    n: number,
    v: string,
    HDW: ChtmlCharData
  ): number {
    if (!n) return 0;
    const [h, d, w] = this.getChar(v, n);
    const css: StyleJsonData = { width: this.em0(w) };
    if (part !== 'ext') {
      //
      // If the non-extender is wider than the assembly,
      //   use negative margins to center over the assembly
      //
      const dw = w > HDW[2] ? this.em((HDW[2] - w) / 2) : 'auto';
      //
      // Non-extenders are 0 height, so place properly
      //
      const y = part === 'beg' ? h : part === 'end' ? -d : (h - d) / 2;
      css.margin = `${this.em(y)} ${dw} ${this.em(-y)}`;
    } else {
      //
      // Set the line-height to have the extenders touch,
      // (plus a little extra for Safari, whose line-height is
      // not accurate), and shift the extender stack to overlap
      // the ends.
      //
      css['line-height'] = this.em0(h + d + 0.005);
      styles[`mjx-stretchy-v${c} > mjx-${part} > mjx-spacer`] = {
        'margin-top': this.em(-d),
      };
    }
    styles[`mjx-stretchy-v${c} > mjx-${part}`] = css;
    return h + d;
  }

  /*******************************************************/

  /**
   * @param {StyleJson} styles         The style object to add styles to
   * @param {number} n                 The delimiter unicode number
   * @param {string} c                 The delimiter character string
   * @param {ChtmlDelimiterData} data  The data for the delimiter whose CSS is to be added
   */
  protected addDelimiterHStyles(
    styles: StyleJson,
    n: number,
    c: string,
    data: ChtmlDelimiterData
  ) {
    const HDW = [...data.HDW] as ChtmlCharData;
    const [beg, ext, end, mid] = data.stretch;
    const [begV, extV, endV, midV] = this.getStretchVariants(n);
    if (data.hd && !this.options.mathmlSpacing) {
      //
      // Interpolate between full character height/depth and that of the extender,
      //   which is what TeX uses, but TeX's fonts are set up to have extra height
      //   or depth for some extenders, so this factor helps get spacing that is closer
      //   to TeX spacing.
      //
      const t = this.params.extender_factor;
      HDW[0] = HDW[0] * (1 - t) + data.hd[0] * t;
      HDW[1] = HDW[1] * (1 - t) + data.hd[1] * t;
    }
    const Wb = this.addDelimiterHPart(styles, c, 'beg', beg, begV, HDW);
    this.addDelimiterHPart(styles, c, 'ext', ext, extV, HDW);
    const We = this.addDelimiterHPart(styles, c, 'end', end, endV, HDW);
    if (mid) {
      const Wm = this.addDelimiterHPart(styles, c, 'mid', mid, midV, HDW);
      const m = this.em0(Wm / 2 - 0.03);
      styles[`mjx-stretchy-h${c} > mjx-ext:first-of-type`] = {
        width: '50%',
        'border-width': `0 ${m} 0 ${this.em0(Wb - 0.03)}`,
      };
      styles[`mjx-stretchy-h${c} > mjx-ext:last-of-type`] = {
        width: '50%',
        'border-width': `0 ${this.em0(We - 0.03)} 0 ${m}`,
      };
    } else if (Wb || We) {
      styles[`mjx-stretchy-h${c} > mjx-ext`]['border-width'] =
        `0 ${this.em0(We - 0.06)} 0 ${this.em0(Wb - 0.06)}`;
    }
    if (data.ext) {
      styles[`mjx-stretchy-h${c} > mjx-ext > mjx-spacer`]['letter-spacing'] =
        this.em(-data.ext);
    }
  }

  /**
   * @param {StyleJson} styles     The style object to add styles to
   * @param {string} c             The vertical character whose part is being added
   * @param {string} part          The name of the part (beg, ext, end, mid) that is being added
   * @param {number} n             The unicode character to use for the part
   * @param {string} v             The variant for the character
   * @param {ChtmlCharData} HDW    The height-depth-width data for the stretchy character
   * @returns {number}             The width of the character
   */
  protected addDelimiterHPart(
    styles: StyleJson,
    c: string,
    part: string,
    n: number,
    v: string,
    HDW: ChtmlCharData
  ): number {
    if (!n) return 0;
    let [, , w, options] = this.getChar(v, n);
    const css: StyleJsonData = {
      padding: this.padding(HDW as ChtmlCharData, w - HDW[2]),
    };
    if (part === 'ext') {
      if (!w && options.dx) {
        w = 2 * options.dx - 0.06;
      }
      styles[`mjx-stretchy-h${c} > mjx-${part} > mjx-spacer`] = {
        'margin-left': this.em(-w / 2),
      };
      if (options.cmb) {
        styles[`mjx-stretchy-h${c} > mjx-${part} > mjx-c`] = {
          width: this.em(w),
          'text-align': 'right',
        };
      }
    } else {
      if (part === 'mid') {
        css['margin'] = `0 ${this.em(-w / 2)}`;
      } else {
        css[part == 'end' ? 'margin-left' : 'margin-right'] = this.em(-w);
      }
      this.checkCombiningChar(options, css);
    }
    styles[`mjx-stretchy-h${c} > mjx-${part}`] = css;
    return w;
  }

  /*******************************************************/

  /**
   * @param {StyleJson} styles      The style object to add styles to
   * @param {string} vletter        The variant class letter (e.g., `B`, `SS`) where this character is being defined
   * @param {number} n              The unicode character being defined
   * @param {ChtmlCharData} data    The bounding box data and options for the character
   */
  protected addCharStyles(
    styles: StyleJson,
    vletter: string,
    n: number,
    data: ChtmlCharData
  ) {
    const options = data[3] as ChtmlCharOptions;
    const letter = options.f !== undefined ? options.f : vletter;
    const font =
      options.ff || (letter ? `${this.cssFontPrefix}-${letter}` : '');
    const selector = 'mjx-c' + this.charSelector(n) + (font ? '.' + font : '');
    const padding = options.oc || options.ic || 0;
    styles[selector] = {
      padding: this.padding(data, padding),
    } as StyleJsonData;
    if (options.oc) {
      styles[selector + '[noic]'] = { 'padding-right': this.em(data[2]) };
    }
    this.checkCombiningChar(options, styles[selector]);
  }

  /**
   * @param {ChtmlCharOptions} options   The character options
   * @param {StyleJsonData} css          The style object to adjust
   */
  protected checkCombiningChar(options: ChtmlCharOptions, css: StyleJsonData) {
    if (!options.cmb) return;
    //
    //  Some browsers now handle combining characters as 0-width even when they aren't, so
    //  we adjust the CSS to handle both automatic 0-width as well as non-zero width characters.
    //
    const pad = (css.padding as string).split(/ /);
    css.width = pad[1];
    pad[1] = '0';
    if (!pad[3]) {
      pad.pop();
    }
    css.padding = pad.join(' ');
  }

  /***********************************************************************/

  /**
   * @param {number} n   The number of ems
   * @returns {string}   The string representing the number with units of "em"
   */
  public em(n: number): string {
    return em(n);
  }

  /**
   * @param {number} n   The number of ems (will be restricted to non-negative values)
   * @returns {string}   The string representing the number with units of "em"
   */
  public em0(n: number): string {
    return em(Math.max(0, n));
  }

  /**
   * @param {number} n   The number of ems (will be restricted to non-negative values, with .1px rather than 0em)
   * @returns {string}   The string representing the number with units of "em"
   */
  public em1(n: number): string {
    const m = em(Math.max(0, n));
    return m === '0' ? '.1px' : m;
  }

  /**
   * @param {ChtmlCharData} data   The [h, d, w] data for the character
   * @param {number} ic            The (optional) italic correction value
   * @returns {string}             The padding string for the h, d, w.
   */
  public padding([h, d, w]: ChtmlCharData, ic: number = 0): string {
    return [h, w + ic, d, 0].map(this.em0).join(' ');
  }

  /**
   * @param {number} n   A unicode code point to be converted to a selector for use with the
   *                     CSS rules for fonts
   * @returns {string}   The character as a selector value.
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
export type CharOptionsMap = { [name: number]: ChtmlCharOptions };
export type CssMap = { [name: number]: number };

/**
 * @param {ChtmlCharMap} font        The font to augment
 * @param {CharOptionsMap} options   Any additional options for characters in the font
 * @returns {ChtmlCharMap}           The augmented font
 */
export function AddCSS(
  font: ChtmlCharMap,
  options: CharOptionsMap
): ChtmlCharMap {
  for (const c of Object.keys(options)) {
    const n = parseInt(c);
    const data = options[n];
    if (data.c) {
      data.c = data.c.replace(/\\[0-9A-F]+/gi, (x) =>
        String.fromCodePoint(parseInt(x.substring(1), 16))
      );
    }
    Object.assign(FontData.charOptions(font, n), data);
  }
  return font;
}
