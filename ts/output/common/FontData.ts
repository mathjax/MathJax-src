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
 * @fileoverview  Implements the FontData class for character bbox data
 *                and stretchy delimiters.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {OptionList, defaultOptions, userOptions} from '../../util/Options.js';
import {StyleList} from '../../util/StyleList.js';
import {asyncLoad} from '../../util/AsyncLoad.js';
import {retryAfter} from '../../util/Retries.js';
import {mathjax} from '../../mathjax.js';
import {DIRECTION} from './Direction.js';
export {DIRECTION} from './Direction.js';

/****************************************************************************/

/**
 * The extra options allowed in a CharData array
 */
export interface CharOptions {
  ic?: number;                  // italic correction value
  sk?: number;                  // skew value
  dx?: number;                  // offset for combining characters
  unknown?: boolean;            // true if not found in the given variant
  smp?: number;                 // Math Alphanumeric codepoint this char is mapped to
}

/****************************************************************************/

/**
 * Data about a character
 *   [height, depth, width, {italic-correction, skew, options}]
 */
export type CharDataArray<C extends CharOptions> =
  [number, number, number] |
  [number, number, number, C];

/**
 * Data about a character or a dynamic file object
 *
 * @template C  The CharOptions type
 */
export type CharData<C extends CharOptions> = DynamicFile | CharDataArray<C>;

/**
 * An object mapping character positions to character data
 *
 * @template C  The CharOptions type
 */
export type CharMap<C extends CharOptions> = {
  [n: number]: CharData<C>;
};

/**
 * An object mapping variants to character maps
 *
 * @template C  The CharOptions type
 */
export type CharMapMap<C extends CharOptions> = {
  [name: string]: CharMap<C>;
};

/****************************************************************************/

/**
 * Data for a variant
 *
 * @template C  The CharOptions type
 */
export interface VariantData<C extends CharOptions> {
  /**
   * A list of CharMaps that must be updated when characters are
   * added to this variant
   */
  linked: CharMap<C>[];
  /**
   * The character data for this variant
   */
  chars: CharMap<C>;
}

/**
 * An object mapping variants names to variant data
 *
 * @template C  The CharOptions type
 * @template V  The VariantData type
 */
export type VariantMap<C extends CharOptions, V extends VariantData<C>> = {
  [name: string]: V;
};


/**
 * Data to use to map unknown characters in a variant to a
 * generic CSS font:
 *
 *    [fontname, italic, bold]
 */
export type CssFontData = [string, boolean, boolean];

/**
 * An object mapping a variant name to the CSS data needed for it
 */
export type CssFontMap = {
  [name: string]: CssFontData;
};

/****************************************************************************/

/**
 * Data needed for stretchy vertical and horizontal characters
 */
export type DelimiterData = {
  dir: DIRECTION;       // vertical or horizontal direction
  sizes?: number[];     // Array of fixed sizes for this character
  variants?: number[];  // The variants in which the different sizes can be found (if not the default)
  schar?: number[];     // The character number to use for each size (if different from the default)
  stretch?: number[];   // The unicode code points for the parts of multi-character versions [beg, ext, end, mid?]
  stretchv?: number[];  // the variants to use for the stretchy characters (index into variant name array)
  HDW?: number[];       // [h, d, w] (for vertical, h and d are the normal size, w is the multi-character width,
                        //            for horizontal, h and d are the multi-character ones, w is for the normal size).
  min?: number;         // The minimum size a multi-character version can be
  c?: number;           // The character number (for aliased delimiters)
  fullExt?: [number, number]  // When present, extenders must be full sized, and the first number is
                              //   the size of the extender, while the second is the total size of the ends
};

/**
 * An object mapping character numbers to delimiter data
 *
 * @template D  The DelimiterData type
 */
export type DelimiterMap<D extends DelimiterData> = {
  [n: number]: D | DynamicFile;
};

/**
 * Delimiter data for a non-stretchy character
 */
export const NOSTRETCH: DelimiterData = {dir: DIRECTION.None};

/****************************************************************************/

/**
 * Data for remapping characters
 */
export type RemapData = string;
export type RemapMap = {
  [key: number]: RemapData;
};
export type RemapMapMap = {
  [key: string]: RemapMap;
};

/**
 * Character remapping data for Math Alphanumerics
 */
export type SmpMap = {
  [c: number]: number;
};

/**
 * Data for Math Alphanumeric conversion:  starting positions for
 *  [Alpha, alpha, Greek, greek, Numbers]
 */
export type SmpData = [number, number, number?, number?, number?];


/****************************************************************************/

/**
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

  min_rule_thickness: number,
  separation_factor: number,
  extra_ic: number
};

/**
 * A list of FontParameters
 */
export type FontParameterList = {
  [key in keyof FontParameters]?: number;
};

/****************************************************************************/

/**
 * Generic Font data
 */
export type Font = FontData<CharOptions, VariantData<CharOptions>, DelimiterData>;

/**
 * A function for setting up an additional character-data file
 */
export type DynamicSetup = ((font: Font) => void);

/**
 * Character numbers or ranges of numbers that cause a dynamic file to be laoded
 */
export type DynamicRanges = (number | [number, number])[];

/**
 * List of characters (number) or ranges ([number, number]) of characters for
 *   each variant in a dynamic font file
 */
export type DynamicVariants = {[name: string]: DynamicRanges};

/**
 * Name and variant data for a dynamic font file
 */
export type DynamicFileDef = [string, DynamicVariants, DynamicRanges?];

/**
 * Data stored about a dynamic font
 */
export type DynamicFile = {
  extension: string;              // name of the extension for this file (or blank)
  file: string;                   // file containing the character data
  variants: DynamicVariants;      // characters in each variant in the file
  delimiters: DynamicRanges;      // delimiters in the file
  setup: DynamicSetup;            // setup function to call to add the characters to the font
  promise: Promise<void>;         // promise for when the file is loaded
  failed: boolean;                // true when loading has failed
};

/**
 * Object listing dynamic file data indexed by file name
 */
export type DynamicFileList = {[name: string]: DynamicFile};

/**
 * Data for dynamic files for a font or font extension
 */
export type DynamicFont = {
  name: string;
  prefix: string;
  files: DynamicFileList;
  sizeN: number;
  stretchN: number;
};

/**
 * The list of dynamic fonts and extensions
 */
export type DynamicFontMap = Map<string, DynamicFont>;

/**
 * Map of characters that load a dynamic file
 */
export type DynamicCharMap = {[name: number]: DynamicFile};

/****************************************************************************/

/**
 * Data for a Font extension
 *
 * @template C  The CharOptions type
 * @template D  The DelimiterData type
 */
export interface FontExtensionData<C extends CharOptions, D extends DelimiterData> {
  name: string;
  options?: OptionList;
  variants?: string[][] | {'[+]'?: string[][], '[-]'?: string[][]};
  cssFonts?: CssFontMap;
  accentMap?: RemapMap;
  moMap?: RemapMap;
  mnMap?: RemapMap;
  parameters?: FontParameterList;
  delimiters?: DelimiterMap<D>;
  chars?: CharMapMap<C>;
  sizeVariants?: string[] | {'[+]'?: string[], '[-]'?: string[]};
  stretchVariants?: string[] | {'[+]'?: string[], '[-]'?: string[]};
  ranges?: DynamicFileDef[];
};

/**
 * Merge options into an object or array.
 */
export function mergeOptions(dst: OptionList, src: OptionList) {
  return defaultOptions([dst], [src])[0];
}

/****************************************************************************/
/**
 *  The FontData class (for storing character bounding box data by variant,
 *                      and the stretchy delimiter data).
 *
 * @template C  The CharOptions type
 * @template V  The VariantData type
 * @template D  The DelimiterData type
 */
export class FontData<C extends CharOptions, V extends VariantData<C>, D extends DelimiterData> {

  /**
   * Options for the font
   */
  public static OPTIONS: OptionList = {
    unknownFamily: 'serif',     // Should use 'monospace' with LiteAdaptor
    dynamicPrefix: '.'          // Location of dynamically loaded files
  };

  /**
   * The name of the output jax this font data is for (used by extensions)
   */
  public static JAX: string = 'common';

  /**
   * The name of the font that is being defined (used by extensions)
   */
  public static NAME: string = '';

  /**
   *  The standard variants to define
   */
  public static defaultVariants = [
    //
    //  The MathML variants
    //
    ['normal'],
    ['bold', 'normal'],
    ['italic', 'normal'],
    ['bold-italic', 'italic', 'bold'],
    ['double-struck', 'bold'],
    ['fraktur', 'normal'],
    ['bold-fraktur', 'bold', 'fraktur'],
    ['script', 'italic'],
    ['bold-script', 'bold-italic', 'script'],
    ['sans-serif', 'normal'],
    ['bold-sans-serif', 'bold', 'sans-serif'],
    ['sans-serif-italic', 'italic', 'sans-serif'],
    ['sans-serif-bold-italic', 'bold-italic', 'bold-sans-serif'],
    ['monospace', 'normal'],

    //
    //  Internal variants needed for TeX input and all output jax
    //
    ['-smallop', 'normal'],
    ['-largeop', 'normal'],
    ['-tex-calligraphic', 'italic'],
    ['-tex-bold-calligraphic', 'bold-italic'],
    ['-tex-oldstyle', 'normal'],
    ['-tex-bold-oldstyle', 'bold'],
    ['-tex-mathit', 'italic'],
    ['-tex-variant', 'normal']
  ];

  /**
   * The family, style, and weight to use for each variant (for unknown characters)
   * The 'unknown' family is replaced by options.unknownFamily
   */
  public static defaultCssFonts: CssFontMap = {
    normal: ['unknown', false, false],
    bold: ['unknown', false, true],
    italic: ['unknown', true, false],
    'bold-italic': ['unknown', true, true],
    'double-struck': ['unknown', false, true],
    fraktur: ['unknown', false, false],
    'bold-fraktur': ['unknown', false, true],
    script: ['cursive', false, false],
    'bold-script': ['cursive', false, true],
    'sans-serif': ['sans-serif', false, false],
    'bold-sans-serif': ['sans-serif', false, true],
    'sans-serif-italic': ['sans-serif', true, false],
    'sans-serif-bold-italic': ['sans-serif', true, true],
    monospace: ['monospace', false, false],

    '-smallop': ['unknown', false, false],
    '-largeop': ['unknown', false, false],
    '-tex-calligraphic': ['cursive', true, false],
    '-tex-bold-calligraphic': ['cursive', true, true],
    '-tex-oldstyle': ['unknown', false, false],
    '-tex-bold-oldstyle': ['unknown', false, true],
    '-tex-mathit': ['unknown', true, false],
    '-tex-variant': ['unknown', false, false]
  };

  /**
   * The default prefix for explicit font-family settings
   */
  protected static defaultCssFamilyPrefix = '';

  /**
   * Variant locations in the Math Alphabnumerics block:
   *  [upper-alpha, lower-alpha, upper-Greek, lower-Greek, numbers]
   */
  public static VariantSmp: {[name: string]: SmpData} = {
    bold: [0x1D400, 0x1D41A, 0x1D6A8, 0x1D6C2, 0x1D7CE],
    italic: [0x1D434, 0x1D44E, 0x1D6E2, 0x1D6FC],
    'bold-italic': [0x1D468, 0x1D482, 0x1D71C, 0x1D736],
    script: [0x1D49C, 0x1D4B6],
    'bold-script': [0x1D4D0, 0x1D4EA],
    fraktur: [0x1D504, 0x1D51E],
    'double-struck': [0x1D538, 0x1D552, , , 0x1D7D8],
    'bold-fraktur': [0x1D56C, 0x1D586],
    'sans-serif': [0x1D5A0, 0x1D5BA, , , 0x1D7E2],
    'bold-sans-serif': [0x1D5D4, 0x1D5EE, 0x1D756, 0x1D770, 0x1D7EC],
    'sans-serif-italic': [0x1D608, 0x1D622],
    'sans-serif-bold-italic': [0x1D63C, 0x1D656, 0x1D790, 0x1D7AA],
    'monospace': [0x1D670, 0x1D68A, , , 0x1D7F6]
  };

  /**
   * Character ranges to remap into Math Alphanumerics
   */
  public static SmpRanges = [
    [0, 0x41, 0x5A],   // Upper-case alpha
    [1, 0x61, 0x7A],   // Lower-case alpha
    [2, 0x391, 0x3A9], // Upper-case Greek
    [3, 0x3B1, 0x3C9], // Lower-case Greek
    [4, 0x30, 0x39]    // Numbers
  ];

  /**
   * Characters to map back top other Unicode positions
   * (holes in the Math Alphanumeric ranges)
   */
  public static SmpRemap: SmpMap = {
    0x1D455: 0x210E,   // PLANCK CONSTANT
    0x1D49D: 0x212C,   // SCRIPT CAPITAL B
    0x1D4A0: 0x2130,   // SCRIPT CAPITAL E
    0x1D4A1: 0x2131,   // SCRIPT CAPITAL F
    0x1D4A3: 0x210B,   // SCRIPT CAPITAL H
    0x1D4A4: 0x2110,   // SCRIPT CAPITAL I
    0x1D4A7: 0x2112,   // SCRIPT CAPITAL L
    0x1D4A8: 0x2133,   // SCRIPT CAPITAL M
    0x1D4AD: 0x211B,   // SCRIPT CAPITAL R
    0x1D4BA: 0x212F,   // SCRIPT SMALL E
    0x1D4BC: 0x210A,   // SCRIPT SMALL G
    0x1D4C4: 0x2134,   // SCRIPT SMALL O
    0x1D506: 0x212D,   // BLACK-LETTER CAPITAL C
    0x1D50B: 0x210C,   // BLACK-LETTER CAPITAL H
    0x1D50C: 0x2111,   // BLACK-LETTER CAPITAL I
    0x1D515: 0x211C,   // BLACK-LETTER CAPITAL R
    0x1D51D: 0x2128,   // BLACK-LETTER CAPITAL Z
    0x1D53A: 0x2102,   // DOUBLE-STRUCK CAPITAL C
    0x1D53F: 0x210D,   // DOUBLE-STRUCK CAPITAL H
    0x1D545: 0x2115,   // DOUBLE-STRUCK CAPITAL N
    0x1D547: 0x2119,   // DOUBLE-STRUCK CAPITAL P
    0x1D548: 0x211A,   // DOUBLE-STRUCK CAPITAL Q
    0x1D549: 0x211D,   // DOUBLE-STRUCK CAPITAL R
    0x1D551: 0x2124,   // DOUBLE-STRUCK CAPITAL Z
  };

  /**
   * Greek upper-case variants
   */
  public static SmpRemapGreekU: SmpMap = {
    0x2207: 0x19,  // nabla
    0x03F4: 0x11   // theta symbol
  };

  /**
   * Greek lower-case variants
   */
  public static SmpRemapGreekL: SmpMap = {
    0x3D1: 0x1B,  // theta symbol
    0x3D5: 0x1D,  // phi symbol
    0x3D6: 0x1F,  // omega symbol
    0x3F0: 0x1C,  // kappa symbol
    0x3F1: 0x1E,  // rho symbol
    0x3F5: 0x1A,  // lunate epsilon symbol
    0x2202: 0x19  // partial differential
  };

  /**
   *  The default remappings
   */
  public static defaultAccentMap: RemapMap = {
    0x005E: '\u02C6',  // hat
    0x007E: '\u02DC',  // tilde
    0x0300: '\u02CB',  // grave accent
    0x0301: '\u02CA',  // acute accent
    0x0302: '\u02C6',  // curcumflex
    0x0303: '\u02DC',  // tilde accent
    0x0304: '\u02C9',  // macron
    0x0306: '\u02D8',  // breve
    0x0307: '\u02D9',  // dot
    0x0308: '\u00A8',  // diaresis
    0x030A: '\u02DA',  // ring above
    0x030C: '\u02C7',  // caron
    0x2192: '\u20D7'
  };

  /**
   * Default map for characters inside <mo>
   */
  protected static defaultMoMap: RemapMap = {
    0x002D: '\u2212' // hyphen
  };

  /**
   * Default map for characters inside <mn>
   */
  protected static defaultMnMap: RemapMap = {
    0x002D: '\u2212' // hyphen
  };

  /**
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
    big_op_spacing4:  .6,
    big_op_spacing5:  .1,

    surd_height:      .075,

    scriptspace:         .05,
    nulldelimiterspace:  .12,
    delimiterfactor:     901,
    delimitershortfall:   .3,

    min_rule_thickness:  1.25,     // in pixels
    separation_factor:   1.75,     // expansion factor for spacing e.g. between accents and base
    extra_ic:            .033      // extra spacing for scripts (compensate for not having actual ic values)
  };


  /**
   * The default delimiter data
   */
  protected static defaultDelimiters: DelimiterMap<DelimiterData> = {};

  /**
   * The default character data
   */
  protected static defaultChars: CharMapMap<CharOptions> = {};

  /**
   * The default variants for the fixed size stretchy delimiters
   */
  protected static defaultSizeVariants: string[] = [];

  /**
   * The default variants for the assembly parts for stretchy delimiters
   */
  protected static defaultStretchVariants: string[] = [];

  /**
   * The dynamic file data
   */
  protected static dynamicFiles: DynamicFileList = {};

  /**
   * The font extension dynamic data
   */
  protected static dynamicExtensions: DynamicFontMap = new Map();

  /**
   * The font options
   */
  protected options: OptionList;

  /**
   * The actual variant information for this font
   */
  protected variant: VariantMap<C, V> = {};

  /**
   * The actual delimiter information for this font
   */
  protected delimiters: DelimiterMap<D> = {};

  /**
   * The actual size variants to use for this font
   */
  protected sizeVariants: string[];

  /**
   * The actual stretchy variants to use for this font
   */
  protected stretchVariants: string[];

  /**
   * The data to use to make variants to default fonts and css for unknown characters
   */
  protected cssFontMap: CssFontMap = {};

  /**
   * A prefix to use for explicit font-family CSS settings
   */
  public cssFamilyPrefix: string;

  /**
   * The prefix to use for font names (e.g., 'TEX')
   */
  public cssFontPrefix: string = '';

  /**
   * The character maps
   */
  protected remapChars: RemapMapMap = {};

  /**
   * The actual font parameters for this font
   */
  public params: FontParameters;

  /**
   * Factor by which to multiply italic correction for computation of delta in munderover
   */
  public skewIcFactor: number = .75;

  /**
   * Any styles needed for the font
   */
  protected _styles: StyleList;

  /**
   * @return {typeof FontData}   The constructor for this object
   */
  public get CLASS(): typeof FontData {
    return this.constructor as typeof FontData;
  }

  /**
   * @param {CharMap} font   The font to check
   * @param {number} n       The character to get options for
   * @return {CharOptions}   The options for the character
   */
  public static charOptions(font: CharMap<CharOptions>, n: number): CharOptions {
    const char = font[n];
    if (!Array.isArray(char)) {
      throw Error(`Character data hasn't been loaded for 0x${n.toString(16).toUpperCase()}`);
    }
    if (char.length === 3) {
      (char as any)[3] = {};
    }
    return char[3];
  }

  /**
   * Define the dynamic file information.
   *
   * @param {DynamicFileDef[]} dynamicFiles   The definitions to make
   * @param {string} extension                The name of the extension for this file (or empty)
   * @return {DynamicFileList}                The object of dynamic file data
   */
  public static defineDynamicFiles(dynamicFiles: DynamicFileDef[], extension: string = ''): DynamicFileList {
    const list: DynamicFileList = {};
    (dynamicFiles || []).map(([file, variants, delimiters]) => {
      list[file] = {
        extension, file, variants, delimiters: delimiters || [],
        promise: null, failed: false, setup: ((_font) => { list[file].failed = true; })
      };
    });
    return list;
  }

  /**
   * Create the setup function for a given dynamically loaded file
   *
   * @param {string} extension      The name of the font extension for this file
   * @param {string} file           The file being loaded
   * @param {CharMapMap} variants   The character data to be added
   *
   * @template C  The CharOptions type
   * @template D  The DelimiterData type
   */
  public static dynamicSetup<C extends CharOptions, D extends DelimiterData>(
    extension: string, file: string,
    variants: CharMapMap<C>, delimiters: DelimiterMap<D> = {},
    fonts: string[] = null
  ) {
    const data = (extension ? this.dynamicExtensions.get(extension) : null);
    const files = (extension ? data.files : this.dynamicFiles);
    files[file].setup = (font) => {
      Object.keys(variants).forEach(name => font.defineChars(name, variants[name]));
      font.defineDelimiters(delimiters);
      extension && this.adjustDelimiters(font.delimiters, Object.keys(delimiters), data.sizeN, data.stretchN);
      fonts && font.addDynamicFontCss(fonts);
    };
  }

  /**
   * @param {DelimiterMap<DelimiteData>} delimiters   The delimiter list to modify
   * @param {string[]} keys                           The ids of the delimiters to check
   * @param {number} sizeN                            The original number of size variants
   * @param {number} stretchN                         The original number ot stretch variants
   */
  public static adjustDelimiters(delimiters: DelimiterMap<DelimiterData>, keys: string[],
                                 sizeN: number, stretchN: number) {
    keys.forEach(id => {
      const delim = delimiters[parseInt(id)];
      if ('dir' in delim) {
        if (delim.variants) {
          delim.variants = this.adjustArrayIndices(delim.variants, sizeN);
        }
        if (delim.stretchv) {
          delim.stretchv = this.adjustArrayIndices(delim.stretchv, stretchN);
        }
      }
    });
  }

  /**
   * @param {number[]} list   The list of numbers to adjust
   * @param {number} N        The pivot number
   */
  protected static adjustArrayIndices(list: number[], N: number) {
    return list.map(n => (n < 0 ? N - 1 - n : n));
  }

  /**
   * Add extension data into the defaults for this font
   *
   * @param {FontExtensionData} data    The extension data to add
   * @param {string} prefix             The [prefix] to add to all component names
   */
  public static addExtension(data: FontExtensionData<CharOptions, DelimiterData>, prefix: string = '') {
    const extension = {
      name: data.name,
      prefix: prefix,
      files: this.defineDynamicFiles(data.ranges, data.name),
      sizeN: this.defaultSizeVariants.length,
      stretchN: this.defaultStretchVariants.length
    };
    this.dynamicExtensions.set(data.name, extension);
    for (const [src, dst] of [
      ['options', 'OPTIONS'],
      ['variants', 'defaultVariants'],
      ['cssFonts', 'defaultCssFonts'],
      ['accentMap', 'defaultAccentMap'],
      ['moMap', 'defaultMoMap'],
      ['mnMap', 'defaultMnMap'],
      ['parameters', 'defaultParams'],
      ['chars', 'defaultChars'],
      ['sizeVariants', 'defaultSizeVariants'],
      ['stretchVariants', 'defaultStretchVariants']
    ] as [keyof FontExtensionData<CharOptions, DelimiterData>, keyof typeof FontData][]) {
      if (data[src]) {
        this[dst] = mergeOptions(this[dst] as OptionList, data[src] as OptionList);
      }
    }
    if (data.delimiters) {
      Object.assign(this.defaultDelimiters, data.delimiters);
      this.adjustDelimiters(this.defaultDelimiters, Object.keys(data.delimiters), extension.sizeN, extension.stretchN);
    }
  }

  /**
   * Copies the data from the defaults to the instance
   *
   * @param {OptionList} options   The options for this font
   *
   * @constructor
   */
  constructor(options: OptionList = null) {
    let CLASS = this.CLASS;
    this.options = userOptions(defaultOptions({}, CLASS.OPTIONS), options);
    this.params = {...CLASS.defaultParams};
    this.sizeVariants = [...CLASS.defaultSizeVariants];
    this.stretchVariants = [...CLASS.defaultStretchVariants];
    this.defineCssFonts(CLASS.defaultCssFonts);
    this.cssFamilyPrefix = CLASS.defaultCssFamilyPrefix;
    this.createVariants(CLASS.defaultVariants);
    this.defineDelimiters(CLASS.defaultDelimiters as DelimiterMap<D>);
    Object.keys(CLASS.defaultChars).forEach(name => this.defineChars(name, CLASS.defaultChars[name] as CharMap<C>));
    this.defineRemap('accent', CLASS.defaultAccentMap);
    this.defineRemap('mo', CLASS.defaultMoMap);
    this.defineRemap('mn', CLASS.defaultMnMap);
    this.defineDynamicCharacters(CLASS.dynamicFiles);
    CLASS.dynamicExtensions.forEach(data => this.defineDynamicCharacters(data.files));
  }

  /**
   * Add an extension to an existing font instance (options will get their defaults).
   *
   * @param {FontExtensionData} data    The data for the font extension to merge into this font.
   * @param {string} prefix             The [prefix] to add to all component names
   */
  public addExtension(data: FontExtensionData<C, D>, prefix: string = '') {
    const dynamicFont = {
      name: data.name,
      prefix: prefix,
      files: this.CLASS.defineDynamicFiles(data.ranges, prefix),
      sizeN: this.sizeVariants.length,
      stretchN: this.stretchVariants.length
    };
    this.CLASS.dynamicExtensions.set(data.name, dynamicFont);

    data.options && defaultOptions(this.options, data.options);
    data.parameters && defaultOptions(this.params, data.parameters);
    if (data.sizeVariants) {
      this.sizeVariants = mergeOptions(this.sizeVariants, data.sizeVariants);
    }
    if (data.stretchVariants) {
      this.stretchVariants = mergeOptions(this.stretchVariants, data.stretchVariants);
    }
    data.cssFonts && this.defineCssFonts(mergeOptions([], data.cssFonts));
    data.variants && this.createVariants(mergeOptions([], data.variants));
    if (data.delimiters) {
      this.defineDelimiters(mergeOptions([], data.delimiters));
      this.CLASS.adjustDelimiters(this.delimiters, Object.keys(data.delimiters),
                                  dynamicFont.sizeN, dynamicFont.stretchN);
    }
    for (const name of Object.keys(data.chars || {})) {
      this.defineChars(name, data.chars[name]);
    }
    data.accentMap && this.defineRemap('accent', data.accentMap);
    data.moMap && this.defineRemap('mo', data.moMap);
    data.mnMap && this.defineRemap('mn', data.mnMap);
    if (data.ranges) {
      this.defineDynamicCharacters(dynamicFont.files);
    }
  }

  /**
   * Returns list of styles needed for the font
   */
  get styles(): StyleList {
    return this._styles;
  }

  /**
   * Sets styles needed for that font.
   */
  set styles(style: StyleList) {
    this._styles = style;
  }

  /**
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
   * @param {string} name     The new variant to create
   * @param {string} inherit  The variant to use if a character is not in this one
   * @param {string} link     A variant to search before the inherit one (but only
   *                           its top-level object).
   */
  public createVariant(name: string, inherit: string = null, link: string = null) {
    let variant = {
      linked: [] as CharMap<C>[],
      chars: Object.create(inherit ? this.variant[inherit].chars : {}) as CharMap<C>
    } as unknown as V;
    if (this.variant[link]) {
      Object.assign(variant.chars, this.variant[link].chars);
      this.variant[link].linked.push(variant.chars);
      variant.chars = Object.create(variant.chars);
    }
    this.remapSmpChars(variant.chars, name);
    this.variant[name] = variant;
  }

  /**
   * Create the mapping from Basic Latin and Greek blocks to
   * the Math Alphanumeric block for a given variant.
   */
  protected remapSmpChars(chars: CharMap<C>, name: string) {
    const CLASS = this.CLASS;
    if (CLASS.VariantSmp[name]) {
      const SmpRemap = CLASS.SmpRemap;
      const SmpGreek = [null, null, CLASS.SmpRemapGreekU, CLASS.SmpRemapGreekL];
      for (const [i, lo, hi] of CLASS.SmpRanges) {
        const base = CLASS.VariantSmp[name][i];
        if (!base) continue;
        for (let n = lo; n <= hi; n++) {
          if (n === 0x3A2) continue;
          const smp = base + n - lo;
          chars[n] = this.smpChar(SmpRemap[smp] || smp);
        }
        if (SmpGreek[i]) {
          for (const n of Object.keys(SmpGreek[i]).map((x) => parseInt(x))) {
            chars[n] = this.smpChar(base + SmpGreek[i][n]);
          }
        }
      }
    }
    if (name === 'bold') {
      chars[0x3DC] = this.smpChar(0x1D7CA);
      chars[0x3DD] = this.smpChar(0x1D7CB);
    }
  }

  /**
   * @param {number} n           Math Alphanumerics position for this remapping
   * @return {CharDataArray<C>}  The character data for the remapping
   */
  protected smpChar(n: number): CharDataArray<C> {
    return [ , , , {smp: n} as C];
  }

  /**
   * Create a collection of variants
   *
   * @param {string[][]} variants  Array of [name, inherit?, link?] values for
   *                              the variants to define
   */
  public createVariants(variants: string[][]) {
    for (const variant of variants) {
      this.createVariant(variant[0], variant[1], variant[2]);
    }
  }

  /**
   * Defines new character data in a given variant
   *  (We use Object.assign() here rather than the spread operator since
   *  the character maps are objeccts with prototypes, and we don't
   *  want to loose those by doing {...chars} or something similar.)
   *
   * @param {string} name    The variant for these characters
   * @param {CharMap} chars  The characters to define
   */
  public defineChars(name: string, chars: CharMap<C>) {
    const variant = this.variant[name];
    Object.assign(variant.chars, chars);
    for (const link of variant.linked) {
      Object.assign(link, chars);
    }
  }

  /**
   * Defined the mapping of variants to CSS fonts for unknown characters in each variant.
   *
   * @param {CssFontMap} fonts    The variants to define and their properties
   */
  public defineCssFonts(fonts: CssFontMap) {
    Object.assign(this.cssFontMap, fonts);
    for (const name of Object.keys(fonts)) {
      if (this.cssFontMap[name][0] === 'unknown') {
        this.cssFontMap[name][0] = this.options.unknownFamily;
      }
    }
  }

  /**
   * Defines stretchy delimiters
   *
   * @param {DelimiterMap} delims  The delimiters to define
   */
  public defineDelimiters(delims: DelimiterMap<D>) {
    Object.assign(this.delimiters, delims);
  }

  /**
   * Defines a character remapping map
   *
   * @param {string} name     The name of the map to define or augment
   * @param {RemapMap} remap  The characters to remap
   */
  public defineRemap(name: string, remap: RemapMap) {
    if (!this.remapChars.hasOwnProperty(name)) {
      this.remapChars[name] = {};
    }
    Object.assign(this.remapChars[name], remap);
  }

  /**
   * Set up the dynamic characters to point to the proper dynamic data object
   *
   * @param {DynamicFileList[]} dynamicFiles   The data objects to process
   */
  public defineDynamicCharacters(dynamicFiles: DynamicFileList) {
    for (const file of Object.keys(dynamicFiles)) {
      const dynamic = dynamicFiles[file];
      for (const name of Object.keys(dynamic.variants)) {
        this.defineChars(name, this.flattenRanges(dynamic.variants[name], dynamic));
      }
      this.defineDelimiters(this.flattenRanges(dynamic.delimiters, dynamic));
    }
  }

  /**
   * Turn a DynamicRange into a mapping of character number to DynamicFile.
   *
   * @param {DynamicRanges} ranges   The ranges to be flattened
   * @param {DynamicFile} dynamic    The DynamicFile to tie to the ranges
   * @return {DynamicCharMap}        The map from character positions to dynamic file
   */
  protected flattenRanges(ranges: DynamicRanges, dynamic: DynamicFile): DynamicCharMap {
    const chars: DynamicCharMap = {};
    for (const n of ranges) {
      if (Array.isArray(n)) {
        for (let j = n[0]; j <= n[1]; j++) {
          chars[j] = dynamic;
        }
      } else {
        chars[n] = dynamic;
      }
    }
    return chars;
  }

  /**
   * @param {DynamicFile} dynamic    The data for the dynamic file
   * @return {string}                The prefixed name for the file
   */
  protected dynamicFileName(dynamic: DynamicFile): string {
    const prefix = (!dynamic.extension ? this.options.dynamicPrefix :
                    this.CLASS.dynamicExtensions.get(dynamic.extension).prefix);
    return (dynamic.file.match(/^(?:[\/\[]|[a-z]+:\/\/|[a-z]:)/i) ? dynamic.file :
      prefix + '/' + dynamic.file.replace(/\.js$/, ''));
  }

  /**
   * Load the data for the character from the proper file,
   *   and do any associated setup that needs access to the FontData instance.
   *
   * @param {DynamicFile} dynamic   The data for the file to load
   * @return {Promise<void>}        The promise that is resolved when the file is loaded
   */
  public async loadDynamicFile(dynamic: DynamicFile): Promise<void> {
    if (dynamic.failed) return Promise.reject(new Error(`dynamic file '${dynamic.file}' failed to load`));
    if (!dynamic.promise) {
      dynamic.promise = asyncLoad(this.dynamicFileName(dynamic)).catch(err => {
        dynamic.failed = true;
        console.warn(err);
      });
    }
    return dynamic.promise.then(() => dynamic.setup(this));
  }

  /**
   * Load all dynamic files.
   *
   * @return {Promise<void[]>}   A promise that is resolved after all the dynamic files are loaded.
   */
  public loadDynamicFiles(): Promise<void[]> {
    const dynamicFiles = this.CLASS.dynamicFiles;
    const promises = Object.keys(dynamicFiles).map(name => this.loadDynamicFile(dynamicFiles[name]));
    for (const data of this.CLASS.dynamicExtensions.values()) {
      promises.push(...Object.keys(data.files).map(name => this.loadDynamicFile(data.files[name])));
    }
    return Promise.all(promises);
  }

  /**
   * Load all dynamic files synchronously, using mathjax.asyncLoad, when it is set to a
   *   synchronous loading function, as in util/asyncLoad/node.ts.
   */
  public loadDynamicFilesSync() {
    if (!mathjax.asyncLoad) {
      throw Error('MathJax(loadDynamicFilesSync): mathjax.asyncLoad must be specified and synchronous');
    }
    const dynamicFiles = this.CLASS.dynamicFiles;
    Object.keys(dynamicFiles).forEach(name => this.loadDynamicFileSync(dynamicFiles[name]));
    for (const data of this.CLASS.dynamicExtensions.values()) {
      Object.keys(data.files).forEach(name => this.loadDynamicFileSync(data.files[name]));
    }
  }

  /**
   * @param {DynamicFile} dynamic    The dynamic file to load
   */
  public loadDynamicFileSync(dynamic: DynamicFile) {
    if (!dynamic.promise) {
      dynamic.promise = Promise.resolve();
      try {
        mathjax.asyncLoad(this.dynamicFileName(dynamic));
      } catch (err) {
        dynamic.failed = true;
        console.warn(err);
      }
      dynamic.setup(this);
    }
  }

  /**
   * Implemented in subclasses
   *
   * @param {string[]} _fonts   The IDs for the fonts to add CSS for
   * @param {string} _root      The root URL for the fonts (can be set by extensions)
   */
  public addDynamicFontCss(_fonts: string[], _root?: string) {
  }

  /**
   * @param {number} n  The delimiter character number whose data is desired
   * @return {DelimiterData}  The data for that delimiter (or undefined)
   */
  public getDelimiter(n: number): DelimiterData {
    const delim = this.delimiters[n];
    if (delim && !('dir' in delim)) {
      this.delimiters[n] = null;
      retryAfter(this.loadDynamicFile(delim));
      return null;
    }
    return delim as DelimiterData;
  }

  /**
   * @param {number} n  The delimiter character number whose variant is needed
   * @param {number} i  The index in the size array of the size whose variant is needed
   * @return {string}   The variant of the i-th size for delimiter n
   */
  public getSizeVariant(n: number, i: number): string {
    const delim = this.getDelimiter(n);
    if (delim && delim.variants) {
      i = delim.variants[i];
    }
    return this.sizeVariants[i];
  }

  /**
   * @param {number} n  The delimiter character number whose variant is needed
   * @param {number} i  The index in the stretch array of the part whose variant is needed
   * @return {string}   The variant of the i-th part for delimiter n
   */
  public getStretchVariant(n: number, i: number): string {
    const delim = this.getDelimiter(n);
    return this.stretchVariants[delim.stretchv ? delim.stretchv[i] : 0];
  }

  /**
   * @param {number} n   The delimiter character number whose variants are needed
   * @return {string[]}  The variants for the parts of the delimiter
   */
  public getStretchVariants(n: number): string[] {
    return [0, 1, 2, 3].map(i => this.getStretchVariant(n, i));
  }

  /**
   * @param {string} name       The variant whose character data is being querried
   * @param {number} n          The unicode number for the character to be found
   * @return {CharDataArray}    The data for the given character (or undefined)
   */
  public getChar(name: string, n: number): CharDataArray<C> {
    const char = this.variant[name].chars[n];
    if (char && !Array.isArray(char)) {
      const variant = this.variant[name];
      delete variant.chars[n];
      variant.linked.forEach(link => delete link[n]);
      retryAfter(this.loadDynamicFile(char));
      return null;
    }
    return char as CharDataArray<C>;
  }

  /**
   * @param {string} name   The name of the variant whose data is to be obtained
   * @return {V}            The data for the requested variant (or undefined)
   */
  public getVariant(name: string): V {
    return this.variant[name];
  }

  /**
   * @param {string} variant   The name of the variant whose data is to be obtained
   * @return {CssFontData}     The CSS data for the requested variant
   */
  public getCssFont(variant: string): CssFontData {
    return this.cssFontMap[variant] || ['serif', false, false];
  }

  /**
   * @param {string} family   The font camily to use
   * @return {string}         The family with the css prefix
   */
  public getFamily(family: string): string {
    return (this.cssFamilyPrefix ? this.cssFamilyPrefix + ', ' + family : family);
  }

  /**
   * @param {string} name   The name of the map to query
   * @param {number} c      The character to remap
   * @return {string}       The remapped character (or the original)
   */
  public getRemappedChar(name: string, c: number): string {
    const map = this.remapChars[name] || {} as RemapMap;
    return map[c];
  }

}

/**
 * The class interface for the FontData class
 *
 * @template C  The CharOptions type
 * @template V  The VariantData type
 * @template D  The DelimiterData type
 */
export interface FontDataClass<C extends CharOptions, V extends VariantData<C>, D extends DelimiterData> {
  OPTIONS: OptionList;
  defaultCssFonts: CssFontMap;
  defaultVariants: string[][];
  defaultParams: FontParameters;
  defaultAccentMap: RemapMap;
  /* tslint:disable-next-line:jsdoc-require */
  charOptions(font: CharMap<C>, n: number): C;
  /* tslint:disable-next-line:jsdoc-require */
  defineDynamicFiles(dynamicFiles: DynamicFileDef[], prefix?: string): DynamicFileList;
  /* tslint:disable-next-line:jsdoc-require */
  dynamicSetup<C extends CharOptions, D extends DelimiterData>(
    font: string, file: string, variants: CharMapMap<C>, delimiters?: DelimiterMap<D>, fonts?: string[]
  ): void;
  /* tslint:disable-next-line:jsdoc-require */
  addExtension(data: FontExtensionData<C, D>, prefix?: string): void;
  new(...args: any[]): FontData<C, V, D>;
}

