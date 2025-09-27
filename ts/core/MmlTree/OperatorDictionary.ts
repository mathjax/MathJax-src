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
 * @file  Defines the operator dictionary structure
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { PropertyList } from '../Tree/Node.js';
import { TEXCLASS } from './MmlNode.js';

/**
 * Types needed for the operator dictionary
 */
export type OperatorDef = [number, number, number, PropertyList];
export type OperatorList = { [name: string]: OperatorDef };
export type RangeDef = [number, number, number, string, string?];

/**
 * @param {number} lspace            The operator's MathML left-hand spacing
 * @param {number} rspace            The operator's MathML right-hand spacing
 * @param {number} texClass          The default TeX class for the operator
 * @param {PropertyList} properties  Any default properties from the operator dictionary
 * @returns {OperatorDef}             The operator definition array
 */
export function OPDEF(
  lspace: number,
  rspace: number,
  texClass: number = TEXCLASS.BIN,
  properties: PropertyList = null
): OperatorDef {
  return [lspace, rspace, texClass, properties] as OperatorDef;
}

/**
 *  The various kinds of operators in the dictionary
 */
export const MO = {
  REL: OPDEF(5, 5, TEXCLASS.REL),
  WIDEREL: OPDEF(5, 5, TEXCLASS.REL, { accent: true, stretchy: true }),
  BIN4: OPDEF(4, 4, TEXCLASS.BIN),
  RELSTRETCH: OPDEF(5, 5, TEXCLASS.REL, { stretchy: true }),
  ORD: OPDEF(0, 0, TEXCLASS.ORD),
  BIN3: OPDEF(3, 3, TEXCLASS.BIN),
  OPEN: OPDEF(0, 0, TEXCLASS.OPEN, {
    fence: true,
    stretchy: true,
    symmetric: true,
  }),
  CLOSE: OPDEF(0, 0, TEXCLASS.CLOSE, {
    fence: true,
    stretchy: true,
    symmetric: true,
  }),
  INTEGRAL: OPDEF(3, 3, TEXCLASS.OP, { largeop: true, symmetric: true }),
  ACCENT: OPDEF(0, 0, TEXCLASS.ORD, { accent: true }),
  WIDEACCENT: OPDEF(0, 0, TEXCLASS.ORD, { accent: true, stretchy: true }),
  OP: OPDEF(3, 3, TEXCLASS.OP, {
    largeop: true,
    movablelimits: true,
    symmetric: true,
  }),
  RELACCENT: OPDEF(5, 5, TEXCLASS.REL, { accent: true }),
  BIN0: OPDEF(0, 0, TEXCLASS.BIN),
  BIN5: OPDEF(5, 5, TEXCLASS.BIN),
  FENCE: OPDEF(0, 0, TEXCLASS.ORD, {
    fence: true,
    stretchy: true,
    symmetric: true,
  }),
  INNER: OPDEF(1, 1, TEXCLASS.INNER),
  ORD30: OPDEF(3, 0, TEXCLASS.ORD),
  NONE: OPDEF(0, 0, TEXCLASS.NONE),
  ORDSTRETCH0: OPDEF(0, 0, TEXCLASS.ORD, { stretchy: true }),
  BINSTRETCH0: OPDEF(0, 0, TEXCLASS.BIN, { stretchy: true }),
  RELSTRETCH0: OPDEF(0, 0, TEXCLASS.REL, { stretchy: true }),
  CLOSE0: OPDEF(0, 0, TEXCLASS.CLOSE, { fence: true }),
  ORD3: OPDEF(3, 3, TEXCLASS.ORD),
  PUNCT03: OPDEF(0, 3, TEXCLASS.PUNCT, { linebreakstyle: 'after' }),
  OPEN0: OPDEF(0, 0, TEXCLASS.OPEN, { fence: true }),
  STRETCH4: OPDEF(4, 4, TEXCLASS.BIN, { stretchy: true }),
};

/**
 *  The default TeX classes for the various unicode blocks, and their names
 */
export const RANGES: RangeDef[] = [
  [0x0020, 0x007f, TEXCLASS.REL, 'mo'], // Basic Latin
  [0x00a0, 0x00bf, TEXCLASS.ORD, 'mo'], // Latin-1 Supplement symbols
  [0x00c0, 0x024f, TEXCLASS.ORD, 'mi'], // Latin-1 Supplement, Latin Extended-A, Latin Extended-B
  [0x02b0, 0x036f, TEXCLASS.ORD, 'mo'], // Spacing modifier letters, Combining Diacritical Marks
  [0x0370, 0x1a20, TEXCLASS.ORD, 'mi'], // Greek and Coptic (through) Tai Tham
  [0x1ab0, 0x1aff, TEXCLASS.ORD, 'mo'], // Combining Diacritical Marks Extended
  [0x1b00, 0x1dbf, TEXCLASS.ORD, 'mi'], // Balinese (through) Phonetic Extensions Supplement
  [0x1dc0, 0x1dff, TEXCLASS.ORD, 'mo'], // Combining Diacritical Marks Supplement
  [0x1e00, 0x1fff, TEXCLASS.ORD, 'mi'], // Latin Extended Additional, Greek Extended
  [0x2000, 0x206f, TEXCLASS.ORD, 'mo'], // General Punctuation
  [0x2070, 0x209f, TEXCLASS.ORD, 'mo'], // Superscript and Subscripts (through) Combining Diacritical Marks for Symbols
  [0x2100, 0x214f, TEXCLASS.ORD, 'mi'], // Letterlike Symbols
  [0x2150, 0x218f, TEXCLASS.ORD, 'mn'], // Number Forms
  [0x2190, 0x21ff, TEXCLASS.REL, 'mo'], // Arrows
  [0x2200, 0x22ff, TEXCLASS.BIN, 'mo'], // Mathematical Operators
  [0x2300, 0x23ff, TEXCLASS.ORD, 'mo'], // Miscellaneous Technical
  [0x2460, 0x24ff, TEXCLASS.ORD, 'mn'], // Enclosed Alphanumerics
  [0x2500, 0x27ef, TEXCLASS.ORD, 'mo'], // Box Drawing (though) Miscellaneous Math Symbols-A
  [0x27f0, 0x27ff, TEXCLASS.REL, 'mo'], // Supplemental Arrows-A
  [0x2800, 0x28ff, TEXCLASS.ORD, 'mtext'], // Braille Patterns
  [0x2900, 0x297f, TEXCLASS.REL, 'mo'], // Supplemental Arrows-B
  [0x2980, 0x29ff, TEXCLASS.ORD, 'mo'], // Miscellaneous Math Symbols-B
  [0x2a00, 0x2aff, TEXCLASS.BIN, 'mo'], // Supplemental Math Operators
  [0x2b00, 0x2b2f, TEXCLASS.ORD, 'mo'], // Miscellaneous Symbols and Arrows
  [0x2b30, 0x2b4f, TEXCLASS.REL, 'mo'], //   Arrows from above
  [0x2b50, 0x2bff, TEXCLASS.ORD, 'mo'], //   Rest of above
  [0x2c00, 0x2de0, TEXCLASS.ORD, 'mi'], // Glagolitic (through) Ethipoc Extended
  [0x2e00, 0x2e7f, TEXCLASS.ORD, 'mo'], // Supplemental Punctuation
  [0x2e80, 0x2fdf, TEXCLASS.ORD, 'mi', 'normal'], // CJK Radicals Supplement (through) Kangxi Radicals
  [0x2ff0, 0x303f, TEXCLASS.ORD, 'mo'], // Ideographic Desc. Characters, CJK Symbols and Punctuation
  [0x3040, 0xa49f, TEXCLASS.ORD, 'mi', 'normal'], // Hiragana (through) Yi Radicals
  [0xa4d0, 0xa82f, TEXCLASS.ORD, 'mi'], // Lisu (through) Syloti Nagri
  [0xa830, 0xa83f, TEXCLASS.ORD, 'mn'], // Common Indic Number FormsArabic Presentation Forms-A
  [0xa840, 0xd7ff, TEXCLASS.ORD, 'mi'], // Phags-pa (though) Hangul Jamo Extended-B
  [0xf900, 0xfaff, TEXCLASS.ORD, 'mi', 'normal'], // CJK Compatibility Ideographs
  [0xfb00, 0xfdff, TEXCLASS.ORD, 'mi'], // Alphabetic Presentation Forms (though) Arabic Presentation Forms-A
  [0xfe00, 0xfe6f, TEXCLASS.ORD, 'mo'], // Variation Selector (through) Small Form Variants
  [0xfe70, 0x100ff, TEXCLASS.ORD, 'mi'], // Arabic Presentation Forms-B (through) Linear B Ideograms
  [0x10100, 0x1018f, TEXCLASS.ORD, 'mn'], // Aegean Numbers, Ancient Greek Numbers
  [0x10190, 0x123ff, TEXCLASS.ORD, 'mi', 'normal'], // Ancient Symbols (through) Cuneiform
  [0x12400, 0x1247f, TEXCLASS.ORD, 'mn'], // Cuneiform Numbers and Punctuation
  [0x12480, 0x1bc9f, TEXCLASS.ORD, 'mi', 'normal'], // Early Dynastic Cuneiform (through) Duployan
  [0x1bca0, 0x1d25f, TEXCLASS.ORD, 'mo'], // Shorthand Format Controls (through) TaiXuan Jing Symbols
  [0x1d360, 0x1d37f, TEXCLASS.ORD, 'mn'], // Counting Rod Numerals
  [0x1d400, 0x1d7cd, TEXCLASS.ORD, 'mi'], // Math Alphanumeric Symbols
  [0x1d7ce, 0x1d7ff, TEXCLASS.ORD, 'mn'], //   Numerals from above
  [0x1df00, 0x1f7ff, TEXCLASS.ORD, 'mo'], // Mahjong Tiles (through) Geometric Shapes Extended
  [0x1f800, 0x1f8ff, TEXCLASS.REL, 'mo'], // Supplemental Arrows-C
  [0x1f900, 0x1f9ff, TEXCLASS.ORD, 'mo'], // Supplemental Symbols and Pictographs
  [0x20000, 0x2fa1f, TEXCLASS.ORD, 'mi', 'normal'], // CJK Unified Ideographs Ext. B (through) CJK Sompatibility Ideographs Supp.
];

/**
 * Get the Unicode range for the first character of a string
 *
 * @param {string} text   The character to check
 * @returns {RangeDef}     The range containing that character, or null
 */
export function getRange(text: string): RangeDef {
  const def =
    OPTABLE.infix[text] || OPTABLE.prefix[text] || OPTABLE.postfix[text];
  if (def) {
    return [0, 0, def[2], 'mo'];
  }
  const n = text.codePointAt(0);
  for (const range of RANGES) {
    if (n <= range[1]) {
      if (n >= range[0]) {
        return range;
      }
      break;
    }
  }
  return [0, 0, TEXCLASS.REL, 'mo'];
}

/**
 * The default MathML spacing for the various TeX classes.
 */
export const MMLSPACING = [
  [0, 0], // ORD
  [1, 2], // OP
  [3, 3], // BIN
  [4, 4], // REL
  [0, 0], // OPEN
  [0, 0], // CLOSE
  [0, 3], // PUNCT
  [1, 1], // INNER
];

/**
 *  The operator dictionary, with sections for the three forms:  prefix, postfix, and infix
 */
/* prettier-ignore */
export const OPTABLE: {[form: string]: OperatorList} = {
  prefix: {
    '!': MO.ORD,                    // exclamation mark
    '(': MO.OPEN,                   // left parenthesis
    '+': MO.BIN0,                   // plus sign
    '-': MO.BIN0,                   // hyphen-minus
    '[': MO.OPEN,                   // left square bracket
    '{': MO.OPEN,                   // left curly bracket
    '|': MO.OPEN,                   // vertical line
    '||': MO.BIN0,                  // multiple character operator: ||
    '\u00AC': MO.ORD,               // not sign: \neg
    '\u00B1': MO.BIN0,              // plus-minus sign: \pm
    '\u2016': MO.FENCE,             // double vertical line
    '\u2018': MO.OPEN0,             // left single quotation mark
    '\u201C': MO.OPEN0,             // left double quotation mark
    '\u2145': MO.ORD30,             // double-struck italic capital d
    '\u2146': MO.ORD30,             // double-struck italic small d
    '\u2200': MO.ORD,               // for all: \forall
    '\u2201': MO.ORD,               // complement
    '\u2202': MO.ORD30,             // partial differential: \partial
    '\u2203': MO.ORD,               // there exists: \exists
    '\u2204': MO.ORD,               // there does not exist
    '\u2207': MO.ORD,               // nabla: \nabla
    '\u220F': MO.OP,                // n-ary product: \prod
    '\u2210': MO.OP,                // n-ary coproduct: \coprod
    '\u2211': MO.OP,                // n-ary summation: \sum
    '\u2212': MO.BIN0,              // minus sign
    '\u2213': MO.BIN0,              // minus-or-plus sign: \mp
    '\u221A': [3, 0, TEXCLASS.ORD, {stretchy: true}], // square root: \surd
    '\u221B': MO.ORD30,             // cube root
    '\u221C': MO.ORD30,             // fourth root
    '\u221F': MO.ORD,               // right angle
    '\u2220': MO.ORD,               // angle: \angle
    '\u2221': MO.ORD,               // measured angle
    '\u2222': MO.ORD,               // spherical angle
    '\u222B': MO.INTEGRAL,          // integral: \smallint
    '\u222C': MO.INTEGRAL,          // double integral
    '\u222D': MO.INTEGRAL,          // triple integral
    '\u222E': MO.INTEGRAL,          // contour integral: \oint
    '\u222F': MO.INTEGRAL,          // surface integral
    '\u2230': MO.INTEGRAL,          // volume integral
    '\u2231': MO.INTEGRAL,          // clockwise integral
    '\u2232': MO.INTEGRAL,          // clockwise contour integral
    '\u2233': MO.INTEGRAL,          // anticlockwise contour integral
    '\u2234': MO.REL,               // therefore
    '\u2235': MO.REL,               // because
    '\u223C': [0, 0, TEXCLASS.REL, {}], // tilde operator: \sim
    '\u22BE': MO.ORD,               // right angle with arc
    '\u22BF': MO.ORD,               // right triangle
    '\u22C0': MO.OP,                // n-ary logical and: \bigwedge
    '\u22C1': MO.OP,                // n-ary logical or: \bigvee
    '\u22C2': MO.OP,                // n-ary intersection: \bigcap
    '\u22C3': MO.OP,                // n-ary union: \bigcup
    '\u2308': MO.OPEN,              // left ceiling: \lceil
    '\u230A': MO.OPEN,              // left floor: \lfloor
    '\u2310': MO.ORD,               // reversed not sign
    '\u2319': MO.ORD,               // turned not sign
    '\u2772': MO.OPEN,              // light left tortoise shell bracket ornament
    '\u2795': MO.ORD,               // heavy plus sign
    '\u2796': MO.ORD,               // heavy minus sign
    '\u27C0': MO.ORD,               // three dimensional angle
    '\u27E6': MO.OPEN,              // mathematical left white square bracket
    '\u27E8': MO.OPEN,              // mathematical left angle bracket: \langle
    '\u27EA': MO.OPEN,              // mathematical left double angle bracket
    '\u27EC': MO.OPEN,              // mathematical left white tortoise shell bracket
    '\u27EE': MO.OPEN,              // mathematical left flattened parenthesis: \lgroup
    '\u2980': MO.FENCE,             // triple vertical bar delimiter
    '\u2983': MO.OPEN,              // left white curly bracket
    '\u2985': MO.OPEN,              // left white parenthesis
    '\u2987': MO.OPEN,              // z notation left image bracket
    '\u2989': MO.OPEN,              // z notation left binding bracket
    '\u298B': MO.OPEN,              // left square bracket with underbar
    '\u298D': MO.OPEN,              // left square bracket with tick in top corner
    '\u298F': MO.OPEN,              // left square bracket with tick in bottom corner
    '\u2991': MO.OPEN,              // left angle bracket with dot
    '\u2993': MO.OPEN,              // left arc less-than bracket
    '\u2995': MO.OPEN,              // double left arc greater-than bracket
    '\u2997': MO.OPEN,              // left black tortoise shell bracket
    '\u2999': MO.FENCE,             // dotted fence
    '\u299B': MO.ORD,               // measured angle opening left
    '\u299C': MO.ORD,               // right angle variant with square
    '\u299D': MO.ORD,               // measured right angle with dot
    '\u299E': MO.ORD,               // angle with s inside
    '\u299F': MO.ORD,               // acute angle
    '\u29A0': MO.ORD,               // spherical angle opening left
    '\u29A1': MO.ORD,               // spherical angle opening up
    '\u29A2': MO.ORD,               // turned angle
    '\u29A3': MO.ORD,               // reversed angle
    '\u29A4': MO.ORD,               // angle with underbar
    '\u29A5': MO.ORD,               // reversed angle with underbar
    '\u29A6': MO.ORD,               // oblique angle opening up
    '\u29A7': MO.ORD,               // oblique angle opening down
    '\u29A8': MO.ORD,               // measured angle with open arm ending in arrow pointing up and right
    '\u29A9': MO.ORD,               // measured angle with open arm ending in arrow pointing up and left
    '\u29AA': MO.ORD,               // measured angle with open arm ending in arrow pointing down and right
    '\u29AB': MO.ORD,               // measured angle with open arm ending in arrow pointing down and left
    '\u29AC': MO.ORD,               // measured angle with open arm ending in arrow pointing right and up
    '\u29AD': MO.ORD,               // measured angle with open arm ending in arrow pointing left and up
    '\u29AE': MO.ORD,               // measured angle with open arm ending in arrow pointing right and down
    '\u29AF': MO.ORD,               // measured angle with open arm ending in arrow pointing left and down
    '\u29D8': MO.OPEN,              // left wiggly fence
    '\u29DA': MO.OPEN,              // left double wiggly fence
    '\u29FC': MO.OPEN,              // left-pointing curved angle bracket
    '\u2A00': MO.OP,                // n-ary circled dot operator: \bigodot
    '\u2A01': MO.OP,                // n-ary circled plus operator: \bigoplus
    '\u2A02': MO.OP,                // n-ary circled times operator: \bigotimes
    '\u2A03': MO.OP,                // n-ary union operator with dot
    '\u2A04': MO.OP,                // n-ary union operator with plus: \biguplus
    '\u2A05': MO.OP,                // n-ary square intersection operator
    '\u2A06': MO.OP,                // n-ary square union operator: \bigsqcup
    '\u2A07': MO.OP,                // two logical and operator
    '\u2A08': MO.OP,                // two logical or operator
    '\u2A09': MO.OP,                // n-ary times operator
    '\u2A0A': MO.OP,                // modulo two sum
    '\u2A0B': MO.INTEGRAL,          // summation with integral
    '\u2A0C': MO.INTEGRAL,          // quadruple integral operator
    '\u2A0D': MO.INTEGRAL,          // finite part integral
    '\u2A0E': MO.INTEGRAL,          // integral with double stroke
    '\u2A0F': MO.INTEGRAL,          // integral average with slash
    '\u2A10': MO.INTEGRAL,          // circulation function
    '\u2A11': MO.INTEGRAL,          // anticlockwise integration
    '\u2A12': MO.INTEGRAL,          // line integration with rectangular path around pole
    '\u2A13': MO.INTEGRAL,          // line integration with semicircular path around pole
    '\u2A14': MO.INTEGRAL,          // line integration not including the pole
    '\u2A15': MO.INTEGRAL,          // integral around a point operator
    '\u2A16': MO.INTEGRAL,          // quaternion integral operator
    '\u2A17': MO.INTEGRAL,          // integral with leftwards arrow with hook
    '\u2A18': MO.INTEGRAL,          // integral with times sign
    '\u2A19': MO.INTEGRAL,          // integral with intersection
    '\u2A1A': MO.INTEGRAL,          // integral with union
    '\u2A1B': MO.INTEGRAL,          // integral with overbar
    '\u2A1C': MO.INTEGRAL,          // integral with underbar
    '\u2A1D': MO.OP,                // join
    '\u2A1E': MO.OP,                // large left triangle operator
    '\u2AEC': MO.ORD,               // double stroke not sign
    '\u2AED': MO.ORD,               // reversed double stroke not sign
    '\u2AFC': MO.OP,                // large triple vertical bar operator
    '\u2AFF': MO.OP,                // n-ary white vertical bar
    '\u3008': MO.OPEN,              // left-pointing angle bracket
  },
  postfix: {
    '!!': MO.BIN0,                  // multiple character operator: !!
    '!': MO.CLOSE0,                 // exclamation mark
    '"': MO.ORD,                    // quotation mark
    '%': MO.ORD,                    // percent sign
    '&': MO.ORD,                    // ampersand
    '\'': MO.ACCENT,                // apostrophe
    ')': MO.CLOSE,                  // right parenthesis
    '++': MO.BIN0,                  // multiple character operator: ++
    '--': MO.BIN0,                  // multiple character operator: --
    ']': MO.CLOSE,                  // right square bracket
    '^': MO.WIDEACCENT,             // circumflex accent
    '_': MO.WIDEACCENT,             // low line
    '`': MO.ACCENT,                 // grave accent
    '|': MO.CLOSE,                  // vertical line
    '||': MO.BIN0,                  // multiple character operator: ||
    '}': MO.CLOSE,                  // right curly bracket
    '~': MO.WIDEACCENT,             // tilde
    '\u00A8': MO.ACCENT,            // diaeresis: \ddot
    '\u00AF': MO.WIDEACCENT,        // macron
    '\u00B0': MO.ACCENT,            // degree sign
    '\u00B2': MO.ORD,               // superscript two
    '\u00B3': MO.ORD,               // superscript three
    '\u00B4': MO.ACCENT,            // acute accent
    '\u00B8': MO.ACCENT,            // cedilla
    '\u00B9': MO.ORD,               // superscript one
    '\u02C6': MO.WIDEACCENT,        // modifier letter circumflex accent: \hat
    '\u02C7': MO.WIDEACCENT,        // caron: \check
    '\u02C9': MO.WIDEACCENT,        // modifier letter macron: \bar
    '\u02CA': MO.ACCENT,            // modifier letter acute accent: \acute
    '\u02CB': MO.ACCENT,            // modifier letter grave accent: \grave
    '\u02CD': MO.WIDEACCENT,        // modifier letter low macron
    '\u02D8': MO.ACCENT,            // breve: \breve
    '\u02D9': MO.ACCENT,            // dot above: \dot
    '\u02DA': MO.ACCENT,            // ring above
    '\u02DC': MO.WIDEACCENT,        // small tilde: \tilde
    '\u02DD': MO.ACCENT,            // double acute accent
    '\u02F7': MO.WIDEACCENT,        // modifier letter low tilde
    '\u0302': MO.WIDEACCENT,        // combining circumflex accent: \hat
    '\u0311': MO.ACCENT,            // combining inverted breve
    '\u2016': MO.FENCE,             // double vertical line
    '\u2019': MO.CLOSE0,            // right single quotation mark
    '\u201A': MO.ORD,               // single low-9 quotation mark
    '\u201B': MO.ORD,               // single high-reversed-9 quotation mark
    '\u201D': MO.CLOSE0,            // right double quotation mark
    '\u201E': MO.ORD,               // double low-9 quotation mark
    '\u201F': MO.ORD,               // double high-reversed-9 quotation mark
    '\u2032': MO.ORD,               // prime: \prime
    '\u2033': MO.ORD,               // double prime
    '\u2034': MO.ORD,               // triple prime
    '\u2035': MO.ORD,               // reversed prime
    '\u2036': MO.ORD,               // reversed double prime
    '\u2037': MO.ORD,               // reversed triple prime
    '\u203E': MO.WIDEACCENT,        // overline
    '\u2057': MO.ORD,               // quadruple prime
    '\u20DB': MO.ACCENT,            // combining three dots above
    '\u20DC': MO.ACCENT,            // combining four dots above
    '\u2309': MO.CLOSE,             // right ceiling: \rceil
    '\u230B': MO.CLOSE,             // right floor: \rfloor
    '\u2322': MO.RELSTRETCH0,       // frown: \frown
    '\u2323': MO.RELSTRETCH0,       // smile: \smile
    '\u23B4': MO.WIDEACCENT,        // top square bracket
    '\u23B5': MO.WIDEACCENT,        // bottom square bracket
    '\u23CD': MO.ORD,               // square foot
    '\u23DC': MO.WIDEACCENT,        // top parenthesis
    '\u23DD': MO.WIDEACCENT,        // bottom parenthesis
    '\u23DE': MO.WIDEACCENT,        // top curly bracket: \overbrace
    '\u23DF': MO.WIDEACCENT,        // bottom curly bracket: \underbrace
    '\u23E0': MO.WIDEACCENT,        // top tortoise shell bracket
    '\u23E1': MO.WIDEACCENT,        // bottom tortoise shell bracket
    '\u2773': MO.CLOSE,             // light right tortoise shell bracket ornament
    '\u27E7': MO.CLOSE,             // mathematical right white square bracket
    '\u27E9': MO.CLOSE,             // mathematical right angle bracket: \rangle
    '\u27EB': MO.CLOSE,             // mathematical right double angle bracket
    '\u27ED': MO.CLOSE,             // mathematical right white tortoise shell bracket
    '\u27EF': MO.CLOSE,             // mathematical right flattened parenthesis: \rgroup
    '\u2980': MO.FENCE,             // triple vertical bar delimiter
    '\u2984': MO.CLOSE,             // right white curly bracket
    '\u2986': MO.CLOSE,             // right white parenthesis
    '\u2988': MO.CLOSE,             // z notation right image bracket
    '\u298A': MO.CLOSE,             // z notation right binding bracket
    '\u298C': MO.CLOSE,             // right square bracket with underbar
    '\u298E': MO.CLOSE,             // right square bracket with tick in bottom corner
    '\u2990': MO.CLOSE,             // right square bracket with tick in top corner
    '\u2992': MO.CLOSE,             // right angle bracket with dot
    '\u2994': MO.CLOSE,             // right arc greater-than bracket
    '\u2996': MO.CLOSE,             // double right arc less-than bracket
    '\u2998': MO.CLOSE,             // right black tortoise shell bracket
    '\u2999': MO.FENCE,             // dotted fence
    '\u29D9': MO.CLOSE,             // right wiggly fence
    '\u29DB': MO.CLOSE,             // right double wiggly fence
    '\u29FD': MO.CLOSE,             // right-pointing curved angle bracket
    '\u3009': MO.CLOSE,             // right-pointing angle bracket
    '\u{1EEF0}': MO.BINSTRETCH0,    // arabic mathematical operator meem with hah with tatweel
    '\u{1EEF1}': MO.BINSTRETCH0,    // arabic mathematical operator hah with dal
  },
  infix: {
    '!': MO.ORD,                    // !
    '!=': MO.BIN5,                  // multiple character operator: !=
    '#': MO.ORD,                    // #
    '$': MO.ORD,                    // $
    '%': MO.ORD3,                   // percent sign
    '&&': MO.BIN4,                  // multiple character operator: &&
    '**': MO.BIN3,                  // multiple character operator: **
    '*': MO.BIN3,                   // asterisk
    '*=': MO.BIN5,                  // multiple character operator: *=
    '+': MO.BIN4,                   // plus sign
    '+=': MO.BIN5,                  // multiple character operator: +=
    ',': MO.PUNCT03,                // comma
    '': MO.ORD,                     // empty <mo>
    '-': MO.BIN4,                   // hyphen-minus
    '-=': MO.BIN5,                  // multiple character operator: -=
    '->': MO.BIN5,                  // multiple character operator: ->
    '.': MO.ORD3,                   // full stop
    '..': MO.BIN3,                  // ..
    '...': MO.INNER,                // ...
    '/': [4, 4, TEXCLASS.ORD, {}],  // solidus
    '//': MO.BIN5,                  // multiple character operator: //
    '/=': MO.BIN5,                  // multiple character operator: /=
    ':': [0, 3, TEXCLASS.REL, {}],  // colon
    ':=': MO.BIN5,                  // multiple character operator: :=
    ';': MO.PUNCT03,                // semicolon
    '<': MO.REL,                    // less-than sign
    '<=': MO.REL,                   // multiple character operator: <=
    '<>': [3, 3, TEXCLASS.REL, {}], // multiple character operator: <>
    '=': MO.REL,                    // equals sign
    '==': MO.REL,                   // multiple character operator: ==
    '>': MO.REL,                    // greater-than sign
    '>=': MO.REL,                   // multiple character operator: >=
    '?': [3, 3, TEXCLASS.CLOSE, {fence: true}], // question mark
    '@': MO.ORD3,                   // commercial at
    '\\': MO.ORD,                   // reverse solidus: \backslash
    '^': [3, 3, TEXCLASS.ORD, {accent: true, stretchy: true}], // circumflex accent
    '_': MO.WIDEACCENT,             // low line
    '|': [5, 5, TEXCLASS.ORD, {}],  // vertical line
    '||': MO.BIN5,                  // multiple character operator: ||
    '\u00B1': MO.BIN4,              // plus-minus sign: \pm
    '\u00B7': MO.BIN3,              // middle dot
    '\u00D7': MO.BIN3,              // multiplication sign: \times
    '\u00F7': MO.BIN4,              // division sign: \div
    '\u02B9': MO.ORD,               // prime
    '\u0300': MO.ACCENT,            // \grave
    '\u0301': MO.ACCENT,            // \acute
    '\u0303': MO.WIDEACCENT,        // \tilde
    '\u0304': MO.ACCENT,            // \bar
    '\u0306': MO.ACCENT,            // \breve
    '\u0307': MO.ACCENT,            // \dot
    '\u0308': MO.ACCENT,            // \ddot
    '\u030C': MO.ACCENT,            // \check
    '\u0332': MO.WIDEACCENT,        // horizontal line
    '\u0338': MO.REL,               // \not
    '\u03F6': MO.REL,               // contains
    '\u2015': MO.ORDSTRETCH0,       // horizontal line
    '\u2017': MO.ORDSTRETCH0,       // horizontal line
    '\u2020': MO.BIN3,              // \dagger
    '\u2021': MO.BIN3,              // \ddagger
    '\u2022': MO.BIN3,              // bullet
    '\u2026': MO.INNER,             // \ldots
    '\u2043': MO.BIN3,              // hyphen bullet
    '\u2044': MO.STRETCH4,          // fraction slash
    '\u2061': MO.NONE,              // function application
    '\u2062': MO.NONE,              // invisible times
    '\u2063': [0, 0, TEXCLASS.NONE, {linebreakstyle: 'after'}], // invisible separator
    '\u2064': MO.NONE,              // invisible plus
    '\u20D7': MO.ACCENT,            // \vec
    '\u2111': MO.ORD,               // \Im
    '\u2113': MO.ORD,               // \ell
    '\u2118': MO.ORD,               // \wp
    '\u211C': MO.ORD,               // \Re
    '\u2190': MO.WIDEREL,           // leftwards arrow: \leftarrow
    '\u2191': MO.RELSTRETCH,        // upwards arrow: \uparrow
    '\u2192': MO.WIDEREL,           // rightwards arrow: \rightarrow
    '\u2193': MO.RELSTRETCH,        // downwards arrow: \downarrow
    '\u2194': MO.WIDEREL,           // left right arrow: \leftrightarrow
    '\u2195': MO.RELSTRETCH,        // up down arrow: \updownarrow
    '\u2196': MO.REL,               // north west arrow: \nwarrow
    '\u2197': MO.REL,               // north east arrow: \nearrow
    '\u2198': MO.REL,               // south east arrow: \searrow
    '\u2199': MO.REL,               // south west arrow: \swarrow
    '\u219A': MO.WIDEREL,           // leftwards arrow with stroke
    '\u219B': MO.WIDEREL,           // rightwards arrow with stroke
    '\u219C': MO.WIDEREL,           // leftwards wave arrow
    '\u219D': MO.WIDEREL,           // rightwards wave arrow
    '\u219E': MO.WIDEREL,           // leftwards two headed arrow
    '\u219F': MO.RELSTRETCH,        // upwards two headed arrow
    '\u21A0': MO.WIDEREL,           // rightwards two headed arrow
    '\u21A1': MO.RELSTRETCH,        // downwards two headed arrow
    '\u21A2': MO.WIDEREL,           // leftwards arrow with tail
    '\u21A3': MO.WIDEREL,           // rightwards arrow with tail
    '\u21A4': MO.WIDEREL,           // leftwards arrow from bar
    '\u21A5': MO.RELSTRETCH,        // upwards arrow from bar
    '\u21A6': MO.WIDEREL,           // rightwards arrow from bar: \mapsto
    '\u21A7': MO.RELSTRETCH,        // downwards arrow from bar
    '\u21A8': MO.RELSTRETCH,        // up down arrow with base
    '\u21A9': MO.WIDEREL,           // leftwards arrow with hook: \hookleftarrow
    '\u21AA': MO.WIDEREL,           // rightwards arrow with hook: \hookrightarrow
    '\u21AB': MO.WIDEREL,           // leftwards arrow with loop
    '\u21AC': MO.WIDEREL,           // rightwards arrow with loop
    '\u21AD': MO.WIDEREL,           // left right wave arrow
    '\u21AE': MO.WIDEREL,           // left right arrow with stroke
    '\u21AF': MO.REL,               // downwards zigzag arrow
    '\u21B0': MO.RELSTRETCH,        // upwards arrow with tip leftwards
    '\u21B1': MO.RELSTRETCH,        // upwards arrow with tip rightwards
    '\u21B2': MO.RELSTRETCH,        // downwards arrow with tip leftwards
    '\u21B3': MO.RELSTRETCH,        // downwards arrow with tip rightwards
    '\u21B4': MO.RELSTRETCH,        // rightwards arrow with corner downwards
    '\u21B5': MO.RELSTRETCH,        // downwards arrow with corner leftwards
    '\u21B6': MO.REL,               // anticlockwise top semicircle arrow
    '\u21B7': MO.REL,               // clockwise top semicircle arrow
    '\u21B8': MO.REL,               // north west arrow to long bar
    '\u21B9': MO.WIDEREL,           // leftwards arrow to bar over rightwards arrow to bar
    '\u21BA': MO.REL,               // anticlockwise open circle arrow
    '\u21BB': MO.REL,               // clockwise open circle arrow
    '\u21BC': MO.WIDEREL,           // leftwards harpoon with barb upwards: \leftharpoonup
    '\u21BD': MO.WIDEREL,           // leftwards harpoon with barb downwards: \leftharpoondown
    '\u21BE': MO.RELSTRETCH,        // upwards harpoon with barb rightwards
    '\u21BF': MO.RELSTRETCH,        // upwards harpoon with barb leftwards
    '\u21C0': MO.WIDEREL,           // rightwards harpoon with barb upwards: \rightharpoonup
    '\u21C1': MO.WIDEREL,           // rightwards harpoon with barb downwards: \rightharpoondown
    '\u21C2': MO.RELSTRETCH,        // downwards harpoon with barb rightwards
    '\u21C3': MO.RELSTRETCH,        // downwards harpoon with barb leftwards
    '\u21C4': MO.WIDEREL,           // rightwards arrow over leftwards arrow
    '\u21C5': MO.RELSTRETCH,        // upwards arrow leftwards of downwards arrow
    '\u21C6': MO.WIDEREL,           // leftwards arrow over rightwards arrow
    '\u21C7': MO.WIDEREL,           // leftwards paired arrows
    '\u21C8': MO.RELSTRETCH,        // upwards paired arrows
    '\u21C9': MO.WIDEREL,           // rightwards paired arrows
    '\u21CA': MO.RELSTRETCH,        // downwards paired arrows
    '\u21CB': MO.WIDEREL,           // leftwards harpoon over rightwards harpoon
    '\u21CC': MO.WIDEREL,           // rightwards harpoon over leftwards harpoon: \rightleftharpoons
    '\u21CD': MO.WIDEREL,           // leftwards double arrow with stroke
    '\u21CE': MO.WIDEREL,           // left right double arrow with stroke
    '\u21CF': MO.WIDEREL,           // rightwards double arrow with stroke
    '\u21D0': MO.WIDEREL,           // leftwards double arrow: \Leftarrow
    '\u21D1': MO.RELSTRETCH,        // upwards double arrow: \Uparrow
    '\u21D2': MO.WIDEREL,           // rightwards double arrow: \Rightarrow
    '\u21D3': MO.RELSTRETCH,        // downwards double arrow: \Downarrow
    '\u21D4': MO.WIDEREL,           // left right double arrow: \Leftrightarrow
    '\u21D5': MO.RELSTRETCH,        // up down double arrow: \Updownarrow
    '\u21D6': MO.REL,               // north west double arrow
    '\u21D7': MO.REL,               // north east double arrow
    '\u21D8': MO.REL,               // south east double arrow
    '\u21D9': MO.REL,               // south west double arrow
    '\u21DA': MO.WIDEREL,           // leftwards triple arrow
    '\u21DB': MO.WIDEREL,           // rightwards triple arrow
    '\u21DC': MO.WIDEREL,           // leftwards squiggle arrow
    '\u21DD': MO.WIDEREL,           // rightwards squiggle arrow
    '\u21DE': MO.RELSTRETCH,        // upwards arrow with double stroke
    '\u21DF': MO.RELSTRETCH,        // downwards arrow with double stroke
    '\u21E0': MO.WIDEREL,           // leftwards dashed arrow
    '\u21E1': MO.RELSTRETCH,        // upwards dashed arrow
    '\u21E2': MO.WIDEREL,           // rightwards dashed arrow
    '\u21E3': MO.RELSTRETCH,        // downwards dashed arrow
    '\u21E4': MO.WIDEREL,           // leftwards arrow to bar
    '\u21E5': MO.WIDEREL,           // rightwards arrow to bar
    '\u21E6': MO.WIDEREL,           // leftwards white arrow
    '\u21E7': MO.RELSTRETCH,        // upwards white arrow
    '\u21E8': MO.WIDEREL,           // rightwards white arrow
    '\u21E9': MO.RELSTRETCH,        // downwards white arrow
    '\u21EA': MO.RELSTRETCH,        // upwards white arrow from bar
    '\u21EB': MO.RELSTRETCH,        // upwards white arrow on pedestal
    '\u21EC': MO.RELSTRETCH,        // upwards white arrow on pedestal with horizontal bar
    '\u21ED': MO.RELSTRETCH,        // upwards white arrow on pedestal with vertical bar
    '\u21EE': MO.RELSTRETCH,        // upwards white double arrow
    '\u21EF': MO.RELSTRETCH,        // upwards white double arrow on pedestal
    '\u21F0': MO.WIDEREL,           // rightwards white arrow from wall
    '\u21F1': MO.REL,               // north west arrow to corner
    '\u21F2': MO.REL,               // south east arrow to corner
    '\u21F3': MO.RELSTRETCH,        // up down white arrow
    '\u21F4': MO.WIDEREL,           // right arrow with small circle
    '\u21F5': MO.RELSTRETCH,        // downwards arrow leftwards of upwards arrow
    '\u21F6': MO.WIDEREL,           // three rightwards arrows
    '\u21F7': MO.WIDEREL,           // leftwards arrow with vertical stroke
    '\u21F8': MO.WIDEREL,           // rightwards arrow with vertical stroke
    '\u21F9': MO.WIDEREL,           // left right arrow with vertical stroke
    '\u21FA': MO.WIDEREL,           // leftwards arrow with double vertical stroke
    '\u21FB': MO.WIDEREL,           // rightwards arrow with double vertical stroke
    '\u21FC': MO.WIDEREL,           // left right arrow with double vertical stroke
    '\u21FD': MO.WIDEREL,           // leftwards open-headed arrow
    '\u21FE': MO.WIDEREL,           // rightwards open-headed arrow
    '\u21FF': MO.WIDEREL,           // left right open-headed arrow
    '\u2205': MO.ORD,               // \emptyset
    '\u2206': MO.ORD,               // increment
    '\u2208': MO.REL,               // element of: \in
    '\u2209': MO.REL,               // not an element of: \notin
    '\u220A': MO.REL,               // small element of
    '\u220B': MO.REL,               // contains as member: \owns
    '\u220C': MO.REL,               // does not contain as member
    '\u220D': MO.REL,               // small contains as member
    '\u2212': MO.BIN4,              // minus sign
    '\u2213': MO.BIN4,              // minus-or-plus sign: \mp
    '\u2214': MO.BIN4,              // dot plus
    '\u2215': MO.STRETCH4,          // division slash
    '\u2216': MO.BIN4,              // set minus: \setminus
    '\u2217': MO.BIN3,              // asterisk operator: \ast
    '\u2218': MO.BIN3,              // ring operator: \circ
    '\u2219': MO.BIN3,              // bullet operator: \bullet
    '\u221D': MO.REL,               // proportional to: \propto
    '\u221E': MO.ORD,               // \infty
    '\u2223': MO.REL,               // divides: \mid
    '\u2224': MO.REL,               // does not divide
    '\u2225': MO.REL,               // parallel to: \parallel
    '\u2226': MO.REL,               // not parallel to
    '\u2227': MO.BIN4,              // logical and: \wedge
    '\u2228': MO.BIN4,              // logical or: \vee
    '\u2229': MO.BIN4,              // intersection: \cap
    '\u222A': MO.BIN4,              // union: \cup
    '\u2236': MO.BIN4,              // ratio
    '\u2237': MO.REL,               // proportion
    '\u2238': MO.BIN4,              // dot minus
    '\u2239': MO.REL,               // excess
    '\u223A': MO.REL,               // geometric proportion
    '\u223B': MO.REL,               // homothetic
    '\u223C': MO.REL,               // tilde operator: \sim
    '\u223D': MO.REL,               // reversed tilde
    '\u223E': MO.REL,               // inverted lazy s
    '\u2240': MO.BIN3,              // wreath product: \wr
    '\u2241': MO.REL,               // not tilde
    '\u2242': MO.REL,               // minus tilde
    '\u2242\u0338': MO.REL,         // not minus tilde
    '\u2243': MO.REL,               // asymptotically equal to: \simeq
    '\u2244': MO.REL,               // not asymptotically equal to
    '\u2245': MO.REL,               // approximately equal to: \cong
    '\u2246': MO.REL,               // approximately but not actually equal to
    '\u2247': MO.REL,               // neither approximately nor actually equal to
    '\u2248': MO.REL,               // almost equal to: \approx
    '\u2249': MO.REL,               // not almost equal to
    '\u224A': MO.REL,               // almost equal or equal to
    '\u224B': MO.REL,               // triple tilde
    '\u224C': MO.REL,               // all equal to
    '\u224D': MO.REL,               // equivalent to: \asymp
    '\u224E': MO.REL,               // geometrically equivalent to
    '\u224F': MO.REL,               // difference between
    '\u2250': MO.REL,               // approaches the limit: \doteq
    '\u2251': MO.REL,               // geometrically equal to
    '\u2252': MO.REL,               // approximately equal to or the image of
    '\u2253': MO.REL,               // image of or approximately equal to
    '\u2254': MO.REL,               // colon equals
    '\u2255': MO.REL,               // equals colon
    '\u2256': MO.REL,               // ring in equal to
    '\u2257': MO.REL,               // ring equal to
    '\u2258': MO.REL,               // corresponds to
    '\u2259': MO.REL,               // estimates
    '\u225A': MO.REL,               // equiangular to
    '\u225B': MO.REL,               // star equals
    '\u225C': MO.REL,               // delta equal to
    '\u225D': MO.REL,               // equal to by definition
    '\u225E': MO.REL,               // measured by
    '\u225F': MO.REL,               // questioned equal to
    '\u2260': MO.REL,               // not equal to: \ne
    '\u2261': MO.REL,               // identical to: \equiv
    '\u2262': MO.REL,               // not identical to
    '\u2263': MO.REL,               // strictly equivalent to
    '\u2264': MO.REL,               // less-than or equal to: \leq
    '\u2265': MO.REL,               // greater-than or equal to: \geq
    '\u2266': MO.REL,               // less-than over equal to
    '\u2266\u0338': MO.REL,         // not less-htan over equal to
    '\u2267': MO.REL,               // greater-than over equal to
    '\u2267\u0338': MO.REL,         // not greater-than over equal to
    '\u2268': MO.REL,               // less-than but not equal to
    '\u2269': MO.REL,               // greater-than but not equal to
    '\u226A': MO.REL,               // much less-than: \ll
    '\u226A\u0338': MO.REL,         // not much less-than
    '\u226B': MO.REL,               // much greater-than: \gg
    '\u226B\u0338': MO.REL,         // not much greater-than
    '\u226C': MO.REL,               // between
    '\u226D': MO.REL,               // not equivalent to
    '\u226E': MO.REL,               // not less-than
    '\u226F': MO.REL,               // not greater-than
    '\u2270': MO.REL,               // neither less-than nor equal to
    '\u2271': MO.REL,               // neither greater-than nor equal to
    '\u2272': MO.REL,               // less-than or equivalent to
    '\u2273': MO.REL,               // greater-than or equivalent to
    '\u2274': MO.REL,               // neither less-than nor equivalent to
    '\u2275': MO.REL,               // neither greater-than nor equivalent to
    '\u2276': MO.REL,               // less-than or greater-than
    '\u2277': MO.REL,               // greater-than or less-than
    '\u2278': MO.REL,               // neither less-than nor greater-than
    '\u2279': MO.REL,               // neither greater-than nor less-than
    '\u227A': MO.REL,               // precedes: \prec
    '\u227B': MO.REL,               // succeeds: \succ
    '\u227C': MO.REL,               // precedes or equal to
    '\u227D': MO.REL,               // succeeds or equal to
    '\u227E': MO.REL,               // precedes or equivalent to
    '\u227E\u0338': MO.REL,         // not precedes or equivalent to
    '\u227F': MO.REL,               // succeeds or equivalent to
    '\u227F\u0338': MO.REL,         // not succeeds or equivalent to
    '\u2280': MO.REL,               // does not precede
    '\u2281': MO.REL,               // does not succeed
    '\u2282': MO.REL,               // subset of: \subset
    '\u2283': MO.REL,               // superset of: \supset
    '\u2284': MO.REL,               // not a subset of
    '\u2285': MO.REL,               // not a superset of
    '\u2286': MO.REL,               // subset of or equal to: \subseteq
    '\u2287': MO.REL,               // superset of or equal to: \supseteq
    '\u2288': MO.REL,               // neither a subset of nor equal to
    '\u2289': MO.REL,               // neither a superset of nor equal to
    '\u228A': MO.REL,               // subset of with not equal to
    '\u228B': MO.REL,               // superset of with not equal to
    '\u228C': MO.BIN4,              // multiset
    '\u228D': MO.BIN4,              // multiset multiplication
    '\u228E': MO.BIN4,              // multiset union: \uplus
    '\u228F': MO.REL,               // square image of
    '\u228F\u0338': MO.REL,         // not square image of
    '\u2290': MO.REL,               // square original of
    '\u2290\u0338': MO.REL,         // not square original of
    '\u2291': MO.REL,               // square image of or equal to: \sqsubseteq
    '\u2292': MO.REL,               // square original of or equal to: \sqsupseteq
    '\u2293': MO.BIN4,              // square cap: \sqcap
    '\u2294': MO.BIN4,              // square cup: \sqcup
    '\u2295': MO.BIN4,              // circled plus: \oplus
    '\u2296': MO.BIN4,              // circled minus: \ominus
    '\u2297': MO.BIN3,              // circled times: \otimes
    '\u2298': MO.BIN4,              // circled division slash: \oslash
    '\u2299': MO.BIN3,              // circled dot operator: \odot
    '\u229A': MO.BIN3,              // circled ring operator
    '\u229B': MO.BIN3,              // circled asterisk operator
    '\u229C': MO.REL,               // circled equals
    '\u229D': MO.BIN4,              // circled dash
    '\u229E': MO.BIN4,              // squared plus
    '\u229F': MO.BIN4,              // squared minus
    '\u22A0': MO.BIN3,              // squared times
    '\u22A1': MO.BIN3,              // squared dot operator
    '\u22A2': MO.REL,               // right tack: \vdash
    '\u22A3': MO.REL,               // left tack: \dashv
    '\u22A4': MO.ORD,               // \top
    '\u22A5': MO.ORD,               // \bot
    '\u22A6': MO.REL,               // assertion
    '\u22A7': MO.REL,               // models
    '\u22A8': MO.REL,               // true: \models
    '\u22A9': MO.REL,               // forces
    '\u22AA': MO.REL,               // triple vertical bar right turnstile
    '\u22AB': MO.REL,               // double vertical bar double right turnstile
    '\u22AC': MO.REL,               // does not prove
    '\u22AD': MO.REL,               // not true
    '\u22AE': MO.REL,               // does not force
    '\u22AF': MO.REL,               // negated double vertical bar double right turnstile
    '\u22B0': MO.REL,               // precedes under relation
    '\u22B1': MO.REL,               // succeeds under relation
    '\u22B2': MO.REL,               // normal subgroup of
    '\u22B3': MO.REL,               // contains as normal subgroup
    '\u22B4': MO.REL,               // normal subgroup of or equal to
    '\u22B5': MO.REL,               // contains as normal subgroup or equal to
    '\u22B6': MO.REL,               // original of
    '\u22B7': MO.REL,               // image of
    '\u22B8': MO.REL,               // multimap
    '\u22BA': MO.BIN3,              // intercalate
    '\u22BB': MO.BIN4,              // xor
    '\u22BC': MO.BIN4,              // nand
    '\u22BD': MO.BIN4,              // nor
    '\u22C4': MO.BIN3,              // diamond operator: \diamond
    '\u22C5': MO.BIN3,              // dot operator: \cdot
    '\u22C6': MO.BIN3,              // star operator: \star
    '\u22C7': MO.BIN3,              // division times
    '\u22C8': MO.REL,               // bowtie: \bowtie
    '\u22C9': MO.BIN3,              // left normal factor semidirect product
    '\u22CA': MO.BIN3,              // right normal factor semidirect product
    '\u22CB': MO.BIN3,              // left semidirect product
    '\u22CC': MO.BIN3,              // right semidirect product
    '\u22CD': MO.REL,               // reversed tilde equals
    '\u22CE': MO.BIN4,              // curly logical or
    '\u22CF': MO.BIN4,              // curly logical and
    '\u22D0': MO.REL,               // double subset
    '\u22D1': MO.REL,               // double superset
    '\u22D2': MO.BIN4,              // double intersection
    '\u22D3': MO.BIN4,              // double union
    '\u22D4': MO.REL,               // pitchfork
    '\u22D5': MO.REL,               // equal and parallel to
    '\u22D6': MO.REL,               // less-than with dot
    '\u22D7': MO.REL,               // greater-than with dot
    '\u22D8': MO.REL,               // very much less-than
    '\u22D9': MO.REL,               // very much greater-than
    '\u22DA': MO.REL,               // less-than equal to or greater-than
    '\u22DB': MO.REL,               // greater-than equal to or less-than
    '\u22DC': MO.REL,               // equal to or less-than
    '\u22DD': MO.REL,               // equal to or greater-than
    '\u22DE': MO.REL,               // equal to or precedes
    '\u22DF': MO.REL,               // equal to or succeeds
    '\u22E0': MO.REL,               // does not precede or equal
    '\u22E1': MO.REL,               // does not succeed or equal
    '\u22E2': MO.REL,               // not square image of or equal to
    '\u22E3': MO.REL,               // not square original of or equal to
    '\u22E4': MO.REL,               // square image of or not equal to
    '\u22E5': MO.REL,               // square original of or not equal to
    '\u22E6': MO.REL,               // less-than but not equivalent to
    '\u22E7': MO.REL,               // greater-than but not equivalent to
    '\u22E8': MO.REL,               // precedes but not equivalent to
    '\u22E9': MO.REL,               // succeeds but not equivalent to
    '\u22EA': MO.REL,               // not normal subgroup of
    '\u22EB': MO.REL,               // does not contain as normal subgroup
    '\u22EC': MO.REL,               // not normal subgroup of or equal to
    '\u22ED': MO.REL,               // does not contain as normal subgroup or equal
    '\u22EE': MO.ORD,               // \vdots
    '\u22EF': MO.INNER,             // \cdots
    '\u22F0': MO.INNER,             // up right diagonal ellipses
    '\u22F1': MO.INNER,             // \ddots
    '\u22F2': MO.REL,               // element of with long horizontal stroke
    '\u22F3': MO.REL,               // element of with vertical bar at end of horizontal stroke
    '\u22F4': MO.REL,               // small element of with vertical bar at end of horizontal stroke
    '\u22F5': MO.REL,               // element of with dot above
    '\u22F6': MO.REL,               // element of with overbar
    '\u22F7': MO.REL,               // small element of with overbar
    '\u22F8': MO.REL,               // element of with underbar
    '\u22F9': MO.REL,               // element of with two horizontal strokes
    '\u22FA': MO.REL,               // contains with long horizontal stroke
    '\u22FB': MO.REL,               // contains with vertical bar at end of horizontal stroke
    '\u22FC': MO.REL,               // small contains with vertical bar at end of horizontal stroke
    '\u22FD': MO.REL,               // contains with overbar
    '\u22FE': MO.REL,               // small contains with overbar
    '\u22FF': MO.REL,               // z notation bag membership
    '\u2301': MO.REL,               // electric arrow
    '\u2305': MO.BIN3,              // projective
    '\u2306': MO.BIN3,              // perspective
    '\u2329': MO.OPEN,              // langle
    '\u232A': MO.CLOSE,             // rangle
    '\u237C': MO.REL,               // right angle with downwards zigzag arrow
    '\u238B': MO.REL,               // broken circle with northwest arrow
    '\u23AA': MO.ORD,               // \bracevert
    '\u23AF': MO.ORDSTRETCH0,       // horizontal line extension
    '\u23B0': MO.OPEN,              // \lmoustache
    '\u23B1': MO.CLOSE,             // \rmoustache
    '\u2500': MO.ORD,               // horizontal line
    '\u25B3': MO.BIN3,              // \bigtriangleup
    '\u25B5': MO.BIN3,              // triangle
    '\u25B9': MO.BIN3,              // \triangleright
    '\u25BD': MO.BIN3,              // \bigtriangledown
    '\u25BF': MO.BIN3,              // triangledown
    '\u25C3': MO.BIN3,              // \triangleleft
    '\u25EF': MO.BIN3,              // \bigcirc
    '\u2660': MO.ORD,               // \spadesuit
    '\u2661': MO.ORD,               // \heartsuit
    '\u2662': MO.ORD,               // \diamondsuit
    '\u2663': MO.ORD,               // \clubsuit
    '\u266D': MO.ORD,               // \flat
    '\u266E': MO.ORD,               // \natural
    '\u266F': MO.ORD,               // \sharp
    '\u2758': [5, 5, TEXCLASS.REL, {stretchy: true, symmetric: true}], // vertical separator
    '\u2794': MO.WIDEREL,           // heavy wide-headed rightwards arrow
    '\u2795': MO.BIN4,              // heavy plus sign
    '\u2796': MO.BIN4,              // heavy minus sign
    '\u2797': MO.BIN4,              // heavy division sign
    '\u2798': MO.REL,               // heavy south east arrow
    '\u2799': MO.WIDEREL,           // heavy rightwards arrow
    '\u279A': MO.REL,               // heavy north east arrow
    '\u279B': MO.WIDEREL,           // drafting point rightwards arrow
    '\u279C': MO.WIDEREL,           // heavy round-tipped rightwards arrow
    '\u279D': MO.WIDEREL,           // triangle-headed rightwards arrow
    '\u279E': MO.WIDEREL,           // heavy triangle-headed rightwards arrow
    '\u279F': MO.WIDEREL,           // dashed triangle-headed rightwards arrow
    '\u27A0': MO.WIDEREL,           // heavy dashed triangle-headed rightwards arrow
    '\u27A1': MO.WIDEREL,           // black rightwards arrow
    '\u27A5': MO.WIDEREL,           // heavy black curved downwards and rightwards arrow
    '\u27A6': MO.WIDEREL,           // heavy black curved upwards and rightwards arrow
    '\u27A7': MO.RELACCENT,         // squat black rightwards arrow
    '\u27A8': MO.WIDEREL,           // heavy concave-pointed black rightwards arrow
    '\u27A9': MO.WIDEREL,           // right-shaded white rightwards arrow
    '\u27AA': MO.WIDEREL,           // left-shaded white rightwards arrow
    '\u27AB': MO.WIDEREL,           // back-tilted shadowed white rightwards arrow
    '\u27AC': MO.WIDEREL,           // front-tilted shadowed white rightwards arrow
    '\u27AD': MO.WIDEREL,           // heavy lower right-shadowed white rightwards arrow
    '\u27AE': MO.WIDEREL,           // heavy upper right-shadowed white rightwards arrow
    '\u27AF': MO.WIDEREL,           // notched lower right-shadowed white rightwards arrow
    '\u27B1': MO.WIDEREL,           // notched upper right-shadowed white rightwards arrow
    '\u27B2': MO.RELACCENT,         // circled heavy white rightwards arrow
    '\u27B3': MO.WIDEREL,           // white-feathered rightwards arrow
    '\u27B4': MO.REL,               // black-feathered south east arrow
    '\u27B5': MO.WIDEREL,           // black-feathered rightwards arrow
    '\u27B6': MO.REL,               // black-feathered north east arrow
    '\u27B7': MO.REL,               // heavy black-feathered south east arrow
    '\u27B8': MO.WIDEREL,           // heavy black-feathered rightwards arrow
    '\u27B9': MO.REL,               // heavy black-feathered north east arrow
    '\u27BA': MO.WIDEREL,           // teardrop-barbed rightwards arrow
    '\u27BB': MO.WIDEREL,           // heavy teardrop-shanked rightwards arrow
    '\u27BC': MO.WIDEREL,           // wedge-tailed rightwards arrow
    '\u27BD': MO.WIDEREL,           // heavy wedge-tailed rightwards arrow
    '\u27BE': MO.WIDEREL,           // open-outlined rightwards arrow
    '\u27C2': MO.REL,               // perpendicular: \perp
    '\u27C2\u0338': MO.REL,         // not perpendicular
    '\u27CB': MO.BIN3,              // mathematical rising diagonal
    '\u27CD': MO.BIN3,              // mathematical falling diagonal
    '\u27F0': MO.RELSTRETCH,        // upwards quadruple arrow
    '\u27F1': MO.RELSTRETCH,        // downwards quadruple arrow
    '\u27F2': MO.REL,               // anticlockwise gapped circle arrow
    '\u27F3': MO.REL,               // clockwise gapped circle arrow
    '\u27F4': MO.RELSTRETCH,        // right arrow with circled plus
    '\u27F5': MO.WIDEREL,           // long leftwards arrow: \longleftarrow
    '\u27F6': MO.WIDEREL,           // long rightwards arrow: \longrightarrow
    '\u27F7': MO.WIDEREL,           // long left right arrow: \longleftrightarrow
    '\u27F8': MO.WIDEREL,           // long leftwards double arrow: \Longleftarrow
    '\u27F9': MO.WIDEREL,           // long rightwards double arrow: \Longrightarrow
    '\u27FA': MO.WIDEREL,           // long left right double arrow: \Longleftrightarrow
    '\u27FB': MO.WIDEREL,           // long leftwards arrow from bar
    '\u27FC': MO.WIDEREL,           // long rightwards arrow from bar: \longmapsto
    '\u27FD': MO.WIDEREL,           // long leftwards double arrow from bar
    '\u27FE': MO.WIDEREL,           // long rightwards double arrow from bar
    '\u27FF': MO.WIDEREL,           // long rightwards squiggle arrow
    '\u2900': MO.WIDEREL,           // rightwards two-headed arrow with vertical stroke
    '\u2901': MO.WIDEREL,           // rightwards two-headed arrow with double vertical stroke
    '\u2902': MO.WIDEREL,           // leftwards double arrow with vertical stroke
    '\u2903': MO.WIDEREL,           // rightwards double arrow with vertical stroke
    '\u2904': MO.WIDEREL,           // left right double arrow with vertical stroke
    '\u2905': MO.WIDEREL,           // rightwards two-headed arrow from bar
    '\u2906': MO.WIDEREL,           // leftwards double arrow from bar
    '\u2907': MO.WIDEREL,           // rightwards double arrow from bar
    '\u2908': MO.RELSTRETCH,        // downwards arrow with horizontal stroke
    '\u2909': MO.RELSTRETCH,        // upwards arrow with horizontal stroke
    '\u290A': MO.RELSTRETCH,        // upwards triple arrow
    '\u290B': MO.RELSTRETCH,        // downwards triple arrow
    '\u290C': MO.WIDEREL,           // leftwards double dash arrow
    '\u290D': MO.WIDEREL,           // rightwards double dash arrow
    '\u290E': MO.WIDEREL,           // leftwards triple dash arrow
    '\u290F': MO.WIDEREL,           // rightwards triple dash arrow
    '\u2910': MO.WIDEREL,           // rightwards two-headed triple dash arrow
    '\u2911': MO.WIDEREL,           // rightwards arrow with dotted stem
    '\u2912': MO.RELSTRETCH,        // upwards arrow to bar
    '\u2913': MO.RELSTRETCH,        // downwards arrow to bar
    '\u2914': MO.WIDEREL,           // rightwards arrow with tail with vertical stroke
    '\u2915': MO.WIDEREL,           // rightwards arrow with tail with double vertical stroke
    '\u2916': MO.WIDEREL,           // rightwards two-headed arrow with tail
    '\u2917': MO.WIDEREL,           // rightwards two-headed arrow with tail with vertical stroke
    '\u2918': MO.WIDEREL,           // rightwards two-headed arrow with tail with double vertical stroke
    '\u2919': MO.WIDEREL,           // leftwards arrow-tail
    '\u291A': MO.WIDEREL,           // rightwards arrow-tail
    '\u291B': MO.WIDEREL,           // leftwards double arrow-tail
    '\u291C': MO.WIDEREL,           // rightwards double arrow-tail
    '\u291D': MO.WIDEREL,           // leftwards arrow to black diamond
    '\u291E': MO.WIDEREL,           // rightwards arrow to black diamond
    '\u291F': MO.WIDEREL,           // leftwards arrow from bar to black diamond
    '\u2920': MO.WIDEREL,           // rightwards arrow from bar to black diamond
    '\u2921': MO.REL,               // north west and south east arrow
    '\u2922': MO.REL,               // north east and south west arrow
    '\u2923': MO.REL,               // north west arrow with hook
    '\u2924': MO.REL,               // north east arrow with hook
    '\u2925': MO.REL,               // south east arrow with hook
    '\u2926': MO.REL,               // south west arrow with hook
    '\u2927': MO.REL,               // north west arrow and north east arrow
    '\u2928': MO.REL,               // north east arrow and south east arrow
    '\u2929': MO.REL,               // south east arrow and south west arrow
    '\u292A': MO.REL,               // south west arrow and north west arrow
    '\u292B': MO.REL,               // rising diagonal crossing falling diagonal
    '\u292C': MO.REL,               // falling diagonal crossing rising diagonal
    '\u292D': MO.REL,               // south east arrow crossing north east arrow
    '\u292E': MO.REL,               // north east arrow crossing south east arrow
    '\u292F': MO.REL,               // falling diagonal crossing north east arrow
    '\u2930': MO.REL,               // rising diagonal crossing south east arrow
    '\u2931': MO.REL,               // north east arrow crossing north west arrow
    '\u2932': MO.REL,               // north west arrow crossing north east arrow
    '\u2933': MO.RELACCENT,         // wave arrow pointing directly right
    '\u2934': MO.RELSTRETCH,        // arrow pointing rightwards then curving upwards
    '\u2935': MO.RELSTRETCH,        // arrow pointing rightwards then curving downwards
    '\u2936': MO.RELSTRETCH,        // arrow pointing downwards then curving leftwards
    '\u2937': MO.RELSTRETCH,        // arrow pointing downwards then curving rightwards
    '\u2938': MO.REL,               // right-side arc clockwise arrow
    '\u2939': MO.REL,               // left-side arc anticlockwise arrow
    '\u293A': MO.RELACCENT,         // top arc anticlockwise arrow
    '\u293B': MO.RELACCENT,         // bottom arc anticlockwise arrow
    '\u293C': MO.RELACCENT,         // top arc clockwise arrow with minus
    '\u293D': MO.RELACCENT,         // top arc anticlockwise arrow with plus
    '\u293E': MO.REL,               // lower right semicircular clockwise arrow
    '\u293F': MO.REL,               // lower left semicircular anticlockwise arrow
    '\u2940': MO.REL,               // anticlockwise closed circle arrow
    '\u2941': MO.REL,               // clockwise closed circle arrow
    '\u2942': MO.WIDEREL,           // rightwards arrow above short leftwards arrow
    '\u2943': MO.WIDEREL,           // leftwards arrow above short rightwards arrow
    '\u2944': MO.WIDEREL,           // short rightwards arrow above leftwards arrow
    '\u2945': MO.RELSTRETCH,        // rightwards arrow with plus below
    '\u2946': MO.RELSTRETCH,        // leftwards arrow with plus below
    '\u2947': MO.WIDEREL,           // rightwards arrow through x
    '\u2948': MO.WIDEREL,           // left right arrow through small circle
    '\u2949': MO.RELSTRETCH,        // upwards two-headed arrow from small circle
    '\u294A': MO.WIDEREL,           // left barb up right barb down harpoon
    '\u294B': MO.WIDEREL,           // left barb down right barb up harpoon
    '\u294C': MO.RELSTRETCH,        // up barb right down barb left harpoon
    '\u294D': MO.RELSTRETCH,        // up barb left down barb right harpoon
    '\u294E': MO.WIDEREL,           // left barb up right barb up harpoon
    '\u294F': MO.RELSTRETCH,        // up barb right down barb right harpoon
    '\u2950': MO.WIDEREL,           // left barb down right barb down harpoon
    '\u2951': MO.RELSTRETCH,        // up barb left down barb left harpoon
    '\u2952': MO.WIDEREL,           // leftwards harpoon with barb up to bar
    '\u2953': MO.WIDEREL,           // rightwards harpoon with barb up to bar
    '\u2954': MO.RELSTRETCH,        // upwards harpoon with barb right to bar
    '\u2955': MO.RELSTRETCH,        // downwards harpoon with barb right to bar
    '\u2956': MO.WIDEREL,           // leftwards harpoon with barb down to bar
    '\u2957': MO.WIDEREL,           // rightwards harpoon with barb down to bar
    '\u2958': MO.RELSTRETCH,        // upwards harpoon with barb left to bar
    '\u2959': MO.RELSTRETCH,        // downwards harpoon with barb left to bar
    '\u295A': MO.WIDEREL,           // leftwards harpoon with barb up from bar
    '\u295B': MO.WIDEREL,           // rightwards harpoon with barb up from bar
    '\u295C': MO.RELSTRETCH,        // upwards harpoon with barb right from bar
    '\u295D': MO.RELSTRETCH,        // downwards harpoon with barb right from bar
    '\u295E': MO.WIDEREL,           // leftwards harpoon with barb down from bar
    '\u295F': MO.WIDEREL,           // rightwards harpoon with barb down from bar
    '\u2960': MO.RELSTRETCH,        // upwards harpoon with barb left from bar
    '\u2961': MO.RELSTRETCH,        // downwards harpoon with barb left from bar
    '\u2962': MO.WIDEREL,           // leftwards harpoon with barb up above leftwards harpoon with barb down
    '\u2963': MO.RELSTRETCH,        // upwards harpoon with barb left beside upwards harpoon with barb right
    '\u2964': MO.WIDEREL,           // rightwards harpoon with barb up above rightwards harpoon with barb down
    '\u2965': MO.RELSTRETCH,        // downwards harpoon with barb left beside downwards harpoon with barb right
    '\u2966': MO.WIDEREL,           // leftwards harpoon with barb up above rightwards harpoon with barb up
    '\u2967': MO.WIDEREL,           // leftwards harpoon with barb down above rightwards harpoon with barb down
    '\u2968': MO.WIDEREL,           // rightwards harpoon with barb up above leftwards harpoon with barb up
    '\u2969': MO.WIDEREL,           // rightwards harpoon with barb down above leftwards harpoon with barb down
    '\u296A': MO.WIDEREL,           // leftwards harpoon with barb up above long dash
    '\u296B': MO.WIDEREL,           // leftwards harpoon with barb down below long dash
    '\u296C': MO.WIDEREL,           // rightwards harpoon with barb up above long dash
    '\u296D': MO.WIDEREL,           // rightwards harpoon with barb down below long dash
    '\u296E': MO.RELSTRETCH,        // upwards harpoon with barb left beside downwards harpoon with barb right
    '\u296F': MO.RELSTRETCH,        // downwards harpoon with barb left beside upwards harpoon with barb right
    '\u2970': MO.WIDEREL,           // right double arrow with rounded head
    '\u2971': MO.WIDEREL,           // equals sign above rightwards arrow
    '\u2972': MO.WIDEREL,           // tilde operator above rightwards arrow
    '\u2973': MO.WIDEREL,           // leftwards arrow above tilde operator
    '\u2974': MO.WIDEREL,           // rightwards arrow above tilde operator
    '\u2975': MO.WIDEREL,           // rightwards arrow above almost equal to
    '\u2976': MO.RELACCENT,         // less-than above leftwards arrow
    '\u2977': MO.RELACCENT,         // leftwards arrow through less-than
    '\u2978': MO.RELACCENT,         // greater-than above rightwards arrow
    '\u2979': MO.RELACCENT,         // subset above rightwards arrow
    '\u297A': MO.RELACCENT,         // leftwards arrow through subset
    '\u297B': MO.RELACCENT,         // superset above leftwards arrow
    '\u297C': MO.WIDEREL,           // left fish tail
    '\u297D': MO.WIDEREL,           // right fish tail
    '\u297E': MO.RELSTRETCH,        // up fish tail
    '\u297F': MO.RELSTRETCH,        // down fish tail
    '\u2981': MO.REL,               // z notation spot
    '\u2982': MO.REL,               // z notation type colon
    '\u29B6': MO.REL,               // circled vertical bar
    '\u29B7': MO.REL,               // circled parallel
    '\u29B8': MO.BIN4,              // circled reverse solidus
    '\u29B9': MO.REL,               // circled perpendicular
    '\u29BC': MO.BIN4,              // circled anticlockwise-rotated division sign
    '\u29C0': MO.REL,               // circled less-than
    '\u29C1': MO.REL,               // circled greater-than
    '\u29C4': MO.BIN4,              // squared rising diagonal slash
    '\u29C5': MO.BIN4,              // squared falling diagonal slash
    '\u29C6': MO.BIN3,              // squared asterisk
    '\u29C7': MO.BIN3,              // squared small circle
    '\u29C8': MO.BIN3,              // squared square
    '\u29CE': MO.REL,               // right triangle above left triangle
    '\u29CF': MO.REL,               // left triangle beside vertical bar
    '\u29D0': MO.REL,               // vertical bar beside right triangle
    '\u29D1': MO.REL,               // bowtie with left half black
    '\u29D2': MO.REL,               // bowtie with right half black
    '\u29D3': MO.REL,               // black bowtie
    '\u29D4': MO.BIN3,              // times with left half black
    '\u29D5': MO.BIN3,              // times with right half black
    '\u29D6': MO.BIN3,              // white hourglass
    '\u29D7': MO.BIN3,              // black hourglass
    '\u29DF': MO.REL,               // double-ended multimap
    '\u29E1': MO.REL,               // increases as
    '\u29E2': MO.BIN3,              // shuffle product
    '\u29E3': MO.REL,               // equals sign and slanted parallel
    '\u29E4': MO.REL,               // equals sign and slanted parallel with tilde above
    '\u29E5': MO.REL,               // identical to and slanted parallel
    '\u29E6': MO.REL,               // gleich stark
    '\u29F4': MO.REL,               // rule-delayed
    '\u29F5': MO.BIN4,              // reverse solidus operator
    '\u29F6': MO.BIN4,              // solidus with overbar
    '\u29F7': MO.BIN4,              // reverse solidus with horizontal stroke
    '\u29F8': MO.BIN4,              // big solidus
    '\u29F9': MO.BIN4,              // big reverse solidus
    '\u29FA': MO.BIN4,              // double plus
    '\u29FB': MO.BIN4,              // triple plus
    '\u2A1D': MO.BIN3,              // join
    '\u2A1E': MO.BIN3,              // large left triangle operator
    '\u2A1F': MO.BIN4,              // z notation schema composition
    '\u2A20': MO.BIN4,              // z notation schema piping
    '\u2A21': MO.BIN4,              // z notation schema projection
    '\u2A22': MO.BIN4,              // plus sign with small circle above
    '\u2A23': MO.BIN4,              // plus sign with circumflex accent above
    '\u2A24': MO.BIN4,              // plus sign with tilde above
    '\u2A25': MO.BIN4,              // plus sign with dot below
    '\u2A26': MO.BIN4,              // plus sign with tilde below
    '\u2A27': MO.BIN4,              // plus sign with subscript two
    '\u2A28': MO.BIN4,              // plus sign with black triangle
    '\u2A29': MO.BIN4,              // minus sign with comma above
    '\u2A2A': MO.BIN4,              // minus sign with dot below
    '\u2A2B': MO.BIN4,              // minus sign with falling dots
    '\u2A2C': MO.BIN4,              // minus sign with rising dots
    '\u2A2D': MO.BIN4,              // plus sign in left half circle
    '\u2A2E': MO.BIN4,              // plus sign in right half circle
    '\u2A2F': MO.BIN3,              // vector or cross product
    '\u2A30': MO.BIN3,              // multiplication sign with dot above
    '\u2A31': MO.BIN3,              // multiplication sign with underbar
    '\u2A32': MO.BIN3,              // semidirect product with bottom closed
    '\u2A33': MO.BIN3,              // smash product
    '\u2A34': MO.BIN3,              // multiplication sign in left half circle
    '\u2A35': MO.BIN3,              // multiplication sign in right half circle
    '\u2A36': MO.BIN3,              // circled multiplication sign with circumflex accent
    '\u2A37': MO.BIN3,              // multiplication sign in double circle
    '\u2A38': MO.BIN4,              // circled division sign
    '\u2A39': MO.BIN4,              // plus sign in triangle
    '\u2A3A': MO.BIN4,              // minus sign in triangle
    '\u2A3B': MO.BIN3,              // multiplication sign in triangle
    '\u2A3C': MO.BIN3,              // interior product
    '\u2A3D': MO.BIN3,              // righthand interior product
    '\u2A3E': MO.BIN4,              // z notation relational composition
    '\u2A3F': MO.BIN3,              // amalgamation or coproduct: \amalg
    '\u2A40': MO.BIN4,              // intersection with dot
    '\u2A41': MO.BIN4,              // union with minus sign
    '\u2A42': MO.BIN4,              // union with overbar
    '\u2A43': MO.BIN4,              // intersection with overbar
    '\u2A44': MO.BIN4,              // intersection with logical and
    '\u2A45': MO.BIN4,              // union with logical or
    '\u2A46': MO.BIN4,              // union above intersection
    '\u2A47': MO.BIN4,              // intersection above union
    '\u2A48': MO.BIN4,              // union above bar above intersection
    '\u2A49': MO.BIN4,              // intersection above bar above union
    '\u2A4A': MO.BIN4,              // union beside and joined with union
    '\u2A4B': MO.BIN4,              // intersection beside and joined with intersection
    '\u2A4C': MO.BIN4,              // closed union with serifs
    '\u2A4D': MO.BIN4,              // closed intersection with serifs
    '\u2A4E': MO.BIN4,              // double square intersection
    '\u2A4F': MO.BIN4,              // double square union
    '\u2A50': MO.BIN3,              // closed union with serifs and smash product
    '\u2A51': MO.BIN4,              // logical and with dot above
    '\u2A52': MO.BIN4,              // logical or with dot above
    '\u2A53': MO.BIN4,              // double logical and
    '\u2A54': MO.BIN4,              // double logical or
    '\u2A55': MO.BIN4,              // two intersecting logical and
    '\u2A56': MO.BIN4,              // two intersecting logical or
    '\u2A57': MO.BIN4,              // sloping large or
    '\u2A58': MO.BIN4,              // sloping large and
    '\u2A59': MO.BIN4,              // logical or overlapping logical and
    '\u2A5A': MO.BIN4,              // logical and with middle stem
    '\u2A5B': MO.BIN4,              // logical or with middle stem
    '\u2A5C': MO.BIN4,              // logical and with horizontal dash
    '\u2A5D': MO.BIN4,              // logical or with horizontal dash
    '\u2A5E': MO.BIN4,              // logical and with double overbar
    '\u2A5F': MO.BIN4,              // logical and with underbar
    '\u2A60': MO.BIN4,              // logical and with double underbar
    '\u2A61': MO.BIN4,              // small vee with underbar
    '\u2A62': MO.BIN4,              // logical or with double overbar
    '\u2A63': MO.BIN4,              // logical or with double underbar
    '\u2A64': MO.BIN3,              // z notation domain antirestriction
    '\u2A65': MO.BIN3,              // z notation range antirestriction
    '\u2A66': MO.REL,               // equals sign with dot below
    '\u2A67': MO.REL,               // identical with dot above
    '\u2A68': MO.REL,               // triple horizontal bar with double vertical stroke
    '\u2A69': MO.REL,               // triple horizontal bar with triple vertical stroke
    '\u2A6A': MO.REL,               // tilde operator with dot above
    '\u2A6B': MO.REL,               // tilde operator with rising dots
    '\u2A6C': MO.REL,               // similar minus similar
    '\u2A6D': MO.REL,               // congruent with dot above
    '\u2A6E': MO.REL,               // equals with asterisk
    '\u2A6F': MO.REL,               // almost equal to with circumflex accent
    '\u2A70': MO.REL,               // approximately equal or equal to
    '\u2A71': MO.REL,               // equals sign above plus sign
    '\u2A72': MO.REL,               // plus sign above equals sign
    '\u2A73': MO.REL,               // equals sign above tilde operator
    '\u2A74': MO.REL,               // double colon equal
    '\u2A75': MO.REL,               // two consecutive equals signs
    '\u2A76': MO.REL,               // three consecutive equals signs
    '\u2A77': MO.REL,               // equals sign with two dots above and two dots below
    '\u2A78': MO.REL,               // equivalent with four dots above
    '\u2A79': MO.REL,               // less-than with circle inside
    '\u2A7A': MO.REL,               // greater-than with circle inside
    '\u2A7B': MO.REL,               // less-than with question mark above
    '\u2A7C': MO.REL,               // greater-than with question mark above
    '\u2A7D': MO.REL,               // less-than or slanted equal to
    '\u2A7D\u0338': MO.REL,         // not less-than or slanted equal to
    '\u2A7E': MO.REL,               // greater-than or slanted equal to
    '\u2A7E\u0338': MO.REL,         // not greater-than or slanted equal to
    '\u2A7F': MO.REL,               // less-than or slanted equal to with dot inside
    '\u2A80': MO.REL,               // greater-than or slanted equal to with dot inside
    '\u2A81': MO.REL,               // less-than or slanted equal to with dot above
    '\u2A82': MO.REL,               // greater-than or slanted equal to with dot above
    '\u2A83': MO.REL,               // less-than or slanted equal to with dot above right
    '\u2A84': MO.REL,               // greater-than or slanted equal to with dot above left
    '\u2A85': MO.REL,               // less-than or approximate
    '\u2A86': MO.REL,               // greater-than or approximate
    '\u2A87': MO.REL,               // less-than and single-line not equal to
    '\u2A88': MO.REL,               // greater-than and single-line not equal to
    '\u2A89': MO.REL,               // less-than and not approximate
    '\u2A8A': MO.REL,               // greater-than and not approximate
    '\u2A8B': MO.REL,               // less-than above double-line equal above greater-than
    '\u2A8C': MO.REL,               // greater-than above double-line equal above less-than
    '\u2A8D': MO.REL,               // less-than above similar or equal
    '\u2A8E': MO.REL,               // greater-than above similar or equal
    '\u2A8F': MO.REL,               // less-than above similar above greater-than
    '\u2A90': MO.REL,               // greater-than above similar above less-than
    '\u2A91': MO.REL,               // less-than above greater-than above double-line equal
    '\u2A92': MO.REL,               // greater-than above less-than above double-line equal
    '\u2A93': MO.REL,               // less-than above slanted equal above greater-than above slanted equal
    '\u2A94': MO.REL,               // greater-than above slanted equal above less-than above slanted equal
    '\u2A95': MO.REL,               // slanted equal to or less-than
    '\u2A96': MO.REL,               // slanted equal to or greater-than
    '\u2A97': MO.REL,               // slanted equal to or less-than with dot inside
    '\u2A98': MO.REL,               // slanted equal to or greater-than with dot inside
    '\u2A99': MO.REL,               // double-line equal to or less-than
    '\u2A9A': MO.REL,               // double-line equal to or greater-than
    '\u2A9B': MO.REL,               // double-line slanted equal to or less-than
    '\u2A9C': MO.REL,               // double-line slanted equal to or greater-than
    '\u2A9D': MO.REL,               // similar or less-than
    '\u2A9E': MO.REL,               // similar or greater-than
    '\u2A9F': MO.REL,               // similar above less-than above equals sign
    '\u2AA0': MO.REL,               // similar above greater-than above equals sign
    '\u2AA1': MO.REL,               // double nested less-than
    '\u2AA2': MO.REL,               // double nested greater-than
    '\u2AA3': MO.REL,               // double nested less-than with underbar
    '\u2AA4': MO.REL,               // greater-than overlapping less-than
    '\u2AA5': MO.REL,               // greater-than beside less-than
    '\u2AA6': MO.REL,               // less-than closed by curve
    '\u2AA7': MO.REL,               // greater-than closed by curve
    '\u2AA8': MO.REL,               // less-than closed by curve above slanted equal
    '\u2AA9': MO.REL,               // greater-than closed by curve above slanted equal
    '\u2AAA': MO.REL,               // smaller than
    '\u2AAB': MO.REL,               // larger than
    '\u2AAC': MO.REL,               // smaller than or equal to
    '\u2AAD': MO.REL,               // larger than or equal to
    '\u2AAE': MO.REL,               // equals sign with bumpy above
    '\u2AAF': MO.REL,               // precedes above single-line equals sign: \preceq
    '\u2AAF\u0338': MO.REL,         // not precedes above single-line equals sign
    '\u2AB0': MO.REL,               // succeeds above single-line equals sign: \succeq
    '\u2AB0\u0338': MO.REL,         // not succeeds above single-line equals sign
    '\u2AB1': MO.REL,               // precedes above single-line not equal to
    '\u2AB2': MO.REL,               // succeeds above single-line not equal to
    '\u2AB3': MO.REL,               // precedes above equals sign
    '\u2AB4': MO.REL,               // succeeds above equals sign
    '\u2AB5': MO.REL,               // precedes above not equal to
    '\u2AB6': MO.REL,               // succeeds above not equal to
    '\u2AB7': MO.REL,               // precedes above almost equal to
    '\u2AB8': MO.REL,               // succeeds above almost equal to
    '\u2AB9': MO.REL,               // precedes above not almost equal to
    '\u2ABA': MO.REL,               // succeeds above not almost equal to
    '\u2ABB': MO.REL,               // double precedes
    '\u2ABC': MO.REL,               // double succeeds
    '\u2ABD': MO.REL,               // subset with dot
    '\u2ABE': MO.REL,               // superset with dot
    '\u2ABF': MO.REL,               // subset with plus sign below
    '\u2AC0': MO.REL,               // superset with plus sign below
    '\u2AC1': MO.REL,               // subset with multiplication sign below
    '\u2AC2': MO.REL,               // superset with multiplication sign below
    '\u2AC3': MO.REL,               // subset of or equal to with dot above
    '\u2AC4': MO.REL,               // superset of or equal to with dot above
    '\u2AC5': MO.REL,               // subset of above equals sign
    '\u2AC6': MO.REL,               // superset of above equals sign
    '\u2AC7': MO.REL,               // subset of above tilde operator
    '\u2AC8': MO.REL,               // superset of above tilde operator
    '\u2AC9': MO.REL,               // subset of above almost equal to
    '\u2ACA': MO.REL,               // superset of above almost equal to
    '\u2ACB': MO.REL,               // subset of above not equal to
    '\u2ACC': MO.REL,               // superset of above not equal to
    '\u2ACD': MO.REL,               // square left open box operator
    '\u2ACE': MO.REL,               // square right open box operator
    '\u2ACF': MO.REL,               // closed subset
    '\u2AD0': MO.REL,               // closed superset
    '\u2AD1': MO.REL,               // closed subset or equal to
    '\u2AD2': MO.REL,               // closed superset or equal to
    '\u2AD3': MO.REL,               // subset above superset
    '\u2AD4': MO.REL,               // superset above subset
    '\u2AD5': MO.REL,               // subset above subset
    '\u2AD6': MO.REL,               // superset above superset
    '\u2AD7': MO.REL,               // superset beside subset
    '\u2AD8': MO.REL,               // superset beside and joined by dash with subset
    '\u2AD9': MO.REL,               // element of opening downwards
    '\u2ADA': MO.REL,               // pitchfork with tee top
    '\u2ADB': MO.BIN4,              // transversal intersection
    '\u2ADD': MO.BIN3,              // nonforking
    '\u2ADD\u0338': MO.REL,         // forking
    '\u2ADE': MO.REL,               // short left tack
    '\u2ADF': MO.REL,               // short down tack
    '\u2AE0': MO.REL,               // short up tack
    '\u2AE1': MO.REL,               // perpendicular with s
    '\u2AE2': MO.REL,               // vertical bar triple right turnstile
    '\u2AE3': MO.REL,               // double vertical bar left turnstile
    '\u2AE4': MO.REL,               // vertical bar double left turnstile
    '\u2AE5': MO.REL,               // double vertical bar double left turnstile
    '\u2AE6': MO.REL,               // long dash from left member of double vertical
    '\u2AE7': MO.REL,               // short down tack with overbar
    '\u2AE8': MO.REL,               // short up tack with underbar
    '\u2AE9': MO.REL,               // short up tack above short down tack
    '\u2AEA': MO.REL,               // double down tack
    '\u2AEB': MO.REL,               // double up tack
    '\u2AEE': MO.REL,               // does not divide with reversed negation slash
    '\u2AF2': MO.REL,               // parallel with horizontal stroke
    '\u2AF3': MO.REL,               // parallel with tilde operator
    '\u2AF4': MO.REL,               // triple vertical bar binary relation
    '\u2AF5': MO.REL,               // triple vertical bar with horizontal stroke
    '\u2AF6': MO.BIN4,              // triple colon operator
    '\u2AF7': MO.REL,               // triple nested less-than
    '\u2AF8': MO.REL,               // triple nested greater-than
    '\u2AF9': MO.REL,               // double-line slanted less-than or equal to
    '\u2AFA': MO.REL,               // double-line slanted greater-than or equal to
    '\u2AFB': MO.BIN4,              // triple solidus binary relation
    '\u2AFD': MO.BIN4,              // double solidus operator
    '\u2AFE': MO.BIN3,              // white vertical bar
    '\u2B00': MO.REL,               // north east white arrow
    '\u2B01': MO.REL,               // north west white arrow
    '\u2B02': MO.REL,               // south east white arrow
    '\u2B03': MO.REL,               // south west white arrow
    '\u2B04': MO.WIDEREL,           // left right white arrow
    '\u2B05': MO.WIDEREL,           // leftwards black arrow
    '\u2B06': MO.RELSTRETCH,        // upwards black arrow
    '\u2B07': MO.RELSTRETCH,        // downwards black arrow
    '\u2B08': MO.REL,               // north east black arrow
    '\u2B09': MO.REL,               // north west black arrow
    '\u2B0A': MO.REL,               // south east black arrow
    '\u2B0B': MO.REL,               // south west black arrow
    '\u2B0C': MO.WIDEREL,           // left right black arrow
    '\u2B0D': MO.RELSTRETCH,        // up down black arrow
    '\u2B0E': MO.RELSTRETCH,        // rightwards arrow with tip downwards
    '\u2B0F': MO.RELSTRETCH,        // rightwards arrow with tip upwards
    '\u2B10': MO.RELSTRETCH,        // leftwards arrow with tip downwards
    '\u2B11': MO.RELSTRETCH,        // leftwards arrow with tip upwards
    '\u2B30': MO.WIDEREL,           // left arrow with small circle
    '\u2B31': MO.WIDEREL,           // three leftwards arrows
    '\u2B32': MO.RELSTRETCH,        // left arrow with circled plus
    '\u2B33': MO.WIDEREL,           // long leftwards squiggle arrow
    '\u2B34': MO.WIDEREL,           // leftwards two-headed arrow with vertical stroke
    '\u2B35': MO.WIDEREL,           // leftwards two-headed arrow with double vertical stroke
    '\u2B36': MO.WIDEREL,           // leftwards two-headed arrow from bar
    '\u2B37': MO.WIDEREL,           // leftwards two-headed triple dash arrow
    '\u2B38': MO.WIDEREL,           // leftwards arrow with dotted stem
    '\u2B39': MO.WIDEREL,           // leftwards arrow with tail with vertical stroke
    '\u2B3A': MO.WIDEREL,           // leftwards arrow with tail with double vertical stroke
    '\u2B3B': MO.WIDEREL,           // leftwards two-headed arrow with tail
    '\u2B3C': MO.WIDEREL,           // leftwards two-headed arrow with tail with vertical stroke
    '\u2B3D': MO.WIDEREL,           // leftwards two-headed arrow with tail with double vertical stroke
    '\u2B3E': MO.WIDEREL,           // leftwards arrow through x
    '\u2B3F': MO.RELACCENT,         // wave arrow pointing directly left
    '\u2B40': MO.WIDEREL,           // equals sign above leftwards arrow
    '\u2B41': MO.WIDEREL,           // reverse tilde operator above leftwards arrow
    '\u2B42': MO.WIDEREL,           // leftwards arrow above reverse almost equal to
    '\u2B43': MO.WIDEREL,           // rightwards arrow through greater-than
    '\u2B44': MO.WIDEREL,           // rightwards arrow through superset
    '\u2B45': MO.WIDEREL,           // leftwards quadruple arrow
    '\u2B46': MO.WIDEREL,           // rightwards quadruple arrow
    '\u2B47': MO.WIDEREL,           // reverse tilde operator above rightwards arrow
    '\u2B48': MO.WIDEREL,           // rightwards arrow above reverse almost equal to
    '\u2B49': MO.WIDEREL,           // tilde operator above leftwards arrow
    '\u2B4A': MO.WIDEREL,           // leftwards arrow above almost equal to
    '\u2B4B': MO.WIDEREL,           // leftwards arrow above reverse tilde operator
    '\u2B4C': MO.WIDEREL,           // rightwards arrow above reverse tilde operator
    '\u2B4D': MO.REL,               // downwards triangle-headed zigzag arrow
    '\u2B4E': MO.REL,               // short slanted north arrow
    '\u2B4F': MO.REL,               // short backslanted south arrow
    '\u2B5A': MO.REL,               // slanted north arrow with hooked head
    '\u2B5B': MO.REL,               // backslanted south arrow with hooked tail
    '\u2B5C': MO.REL,               // slanted north arrow with horizontal tail
    '\u2B5D': MO.REL,               // backslanted south arrow with horizontal tail
    '\u2B5E': MO.REL,               // bent arrow pointing downwards then north east
    '\u2B5F': MO.REL,               // short bent arrow pointing downwards then north east
    '\u2B60': MO.WIDEREL,           // leftwards triangle-headed arrow
    '\u2B61': MO.RELSTRETCH,        // upwards triangle-headed arrow
    '\u2B62': MO.WIDEREL,           // rightwards triangle-headed arrow
    '\u2B63': MO.RELSTRETCH,        // downwards triangle-headed arrow
    '\u2B64': MO.WIDEREL,           // left right triangle-headed arrow
    '\u2B65': MO.RELSTRETCH,        // up down triangle-headed arrow
    '\u2B66': MO.REL,               // north west triangle-headed arrow
    '\u2B67': MO.REL,               // north east triangle-headed arrow
    '\u2B68': MO.REL,               // south east triangle-headed arrow
    '\u2B69': MO.REL,               // south west triangle-headed arrow
    '\u2B6A': MO.WIDEREL,           // leftwards triangle-headed dashed arrow
    '\u2B6B': MO.RELSTRETCH,        // upwards triangle-headed dashed arrow
    '\u2B6C': MO.WIDEREL,           // rightwards triangle-headed dashed arrow
    '\u2B6D': MO.RELSTRETCH,        // downwards triangle-headed dashed arrow
    '\u2B6E': MO.REL,               // clockwise triangle-headed open circle arrow
    '\u2B6F': MO.REL,               // anticlockwise triangle-headed open circle arrow
    '\u2B70': MO.WIDEREL,           // leftwards triangle-headed arrow to bar
    '\u2B71': MO.RELSTRETCH,        // upwards triangle-headed arrow to bar
    '\u2B72': MO.WIDEREL,           // rightwards triangle-headed arrow to bar
    '\u2B73': MO.RELSTRETCH,        // downwards triangle-headed arrow to bar
    '\u2B76': MO.REL,               // north west triangle-headed arrow to bar
    '\u2B77': MO.REL,               // north east triangle-headed arrow to bar
    '\u2B78': MO.REL,               // south east triangle-headed arrow to bar
    '\u2B79': MO.REL,               // south west triangle-headed arrow to bar
    '\u2B7A': MO.WIDEREL,           // leftwards triangle-headed arrow with double horizontal stroke
    '\u2B7B': MO.RELSTRETCH,        // upwards triangle-headed arrow with double horizontal stroke
    '\u2B7C': MO.WIDEREL,           // rightwards triangle-headed arrow with double horizontal stroke
    '\u2B7D': MO.RELSTRETCH,        // downwards triangle-headed arrow with double horizontal stroke
    '\u2B80': MO.WIDEREL,           // leftwards triangle-headed arrow over rightwards triangle-headed arrow
    '\u2B81': MO.RELSTRETCH,        // upwards triangle-headed arrow leftwards of downwards triangle-headed arrow
    '\u2B82': MO.WIDEREL,           // rightwards triangle-headed arrow over leftwards triangle-headed arrow
    '\u2B83': MO.RELSTRETCH,        // downwards triangle-headed arrow leftwards of upwards triangle-headed arrow
    '\u2B84': MO.WIDEREL,           // leftwards triangle-headed paired arrows
    '\u2B85': MO.RELSTRETCH,        // upwards triangle-headed paired arrows
    '\u2B86': MO.WIDEREL,           // rightwards triangle-headed paired arrows
    '\u2B87': MO.RELSTRETCH,        // downwards triangle-headed paired arrows
    '\u2B88': MO.RELACCENT,         // leftwards black circled white arrow
    '\u2B89': MO.REL,               // upwards black circled white arrow
    '\u2B8A': MO.RELACCENT,         // rightwards black circled white arrow
    '\u2B8B': MO.REL,               // downwards black circled white arrow
    '\u2B8C': MO.REL,               // anticlockwise triangle-headed right u-shaped arrow
    '\u2B8D': MO.REL,               // anticlockwise triangle-headed bottom u-shaped arrow
    '\u2B8E': MO.REL,               // anticlockwise triangle-headed left u-shaped arrow
    '\u2B8F': MO.REL,               // anticlockwise triangle-headed top u-shaped arrow
    '\u2B94': MO.REL,               // four corner arrows circling anticlockwise
    '\u2B95': MO.WIDEREL,           // rightwards black arrow
    '\u2BA0': MO.RELSTRETCH,        // downwards triangle-headed arrow with long tip leftwards
    '\u2BA1': MO.RELSTRETCH,        // downwards triangle-headed arrow with long tip rightwards
    '\u2BA2': MO.RELSTRETCH,        // upwards triangle-headed arrow with long tip leftwards
    '\u2BA3': MO.RELSTRETCH,        // upwards triangle-headed arrow with long tip rightwards
    '\u2BA4': MO.RELSTRETCH,        // leftwards triangle-headed arrow with long tip upwards
    '\u2BA5': MO.RELSTRETCH,        // rightwards triangle-headed arrow with long tip upwards
    '\u2BA6': MO.RELSTRETCH,        // leftwards triangle-headed arrow with long tip downwards
    '\u2BA7': MO.RELSTRETCH,        // rightwards triangle-headed arrow with long tip downwards
    '\u2BA8': MO.WIDEREL,           // black curved downwards and leftwards arrow
    '\u2BA9': MO.WIDEREL,           // black curved downwards and rightwards arrow
    '\u2BAA': MO.WIDEREL,           // black curved upwards and leftwards arrow
    '\u2BAB': MO.WIDEREL,           // black curved upwards and rightwards arrow
    '\u2BAC': MO.RELSTRETCH,        // black curved leftwards and upwards arrow
    '\u2BAD': MO.RELSTRETCH,        // black curved rightwards and upwards arrow
    '\u2BAE': MO.RELSTRETCH,        // black curved leftwards and downwards arrow
    '\u2BAF': MO.RELSTRETCH,        // black curved rightwards and downwards arrow
    '\u2BB0': MO.REL,               // ribbon arrow down left
    '\u2BB1': MO.REL,               // ribbon arrow down right
    '\u2BB2': MO.REL,               // ribbon arrow up left
    '\u2BB3': MO.REL,               // ribbon arrow up right
    '\u2BB4': MO.REL,               // ribbon arrow left up
    '\u2BB5': MO.REL,               // ribbon arrow right up
    '\u2BB6': MO.REL,               // ribbon arrow left down
    '\u2BB7': MO.REL,               // ribbon arrow right down
    '\u2BB8': MO.RELSTRETCH,        // upwards white arrow from bar with horizontal bar
    '\u2BD1': MO.REL,               // uncertainty sign
    '\u3ADC': MO.BIN3,              // forking
    '\uFE37': MO.WIDEACCENT,        // horizontal brace down
    '\uFE38': MO.WIDEACCENT,        // horizontal brace up
  },
};
