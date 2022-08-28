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
 * @fileoverview  The MathJax TeXFont object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {ChtmlFontData, ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData, ChtmlFontDataClass,
        DelimiterMap, CharMapMap} from '../../chtml/FontData.js';
import {CommonTeXFontMixin} from './common.js';
import {StringMap} from '../../chtml/Wrapper.js';

import {boldItalic} from './chtml/bold-italic.js';
import {bold} from './chtml/bold.js';
import {doubleStruck} from './chtml/double-struck.js';
import {frakturBold} from './chtml/fraktur-bold.js';
import {fraktur} from './chtml/fraktur.js';
import {italic} from './chtml/italic.js';
import {largeop} from './chtml/largeop.js';
import {monospace} from './chtml/monospace.js';
import {normal} from './chtml/normal.js';
import {sansSerifBoldItalic} from './chtml/sans-serif-bold-italic.js';
import {sansSerifBold} from './chtml/sans-serif-bold.js';
import {sansSerifItalic} from './chtml/sans-serif-italic.js';
import {sansSerif} from './chtml/sans-serif.js';
import {scriptBold} from './chtml/script-bold.js';
import {script} from './chtml/script.js';
import {smallop} from './chtml/smallop.js';
import {texCalligraphicBold} from './chtml/tex-calligraphic-bold.js';
import {texCalligraphic} from './chtml/tex-calligraphic.js';
import {texMathit} from './chtml/tex-mathit.js';
import {texOldstyleBold} from './chtml/tex-oldstyle-bold.js';
import {texOldstyle} from './chtml/tex-oldstyle.js';
import {texSize3} from './chtml/tex-size3.js';
import {texSize4} from './chtml/tex-size4.js';
import {texVariant} from './chtml/tex-variant.js';

import {delimiters} from './common/delimiters.js';

/*=================================================================================*/
/**
 *  The TeXFont class
 */
const Base = CommonTeXFontMixin
  <ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData, ChtmlFontDataClass>(ChtmlFontData);

export class TeXFont extends Base {

  /**
   * @override
   */
  public static OPTIONS = {
    ...Base.OPTIONS,
    dynamicPrefix: Base.OPTIONS.dynamicPrefix + '/tex/dynamic'
  };

  /**
   * Fonts to prefix any explicit ones
   */
  protected static defaultCssFamilyPrefix = 'MJXZERO';

  /**
   * The letters that identify the default font for each varaint
   */
  protected static defaultVariantLetters: StringMap = {
    'normal': '',
    'bold': 'B',
    'italic': 'MI',
    'bold-italic': 'BI',
    'double-struck': 'A',
    'fraktur': 'FR',
    'bold-fraktur': 'FRB',
    'script': 'SC',
    'bold-script': 'SCB',
    'sans-serif': 'SS',
    'bold-sans-serif': 'SSB',
    'sans-serif-italic': 'SSI',
    'sans-serif-bold-italic': 'SSBI',
    'monospace': 'T',
    '-smallop': 'S1',
    '-largeop': 'S2',
    '-size3': 'S3',
    '-size4': 'S4',
    '-tex-calligraphic': 'C',
    '-tex-bold-calligraphic': 'CB',
    '-tex-mathit': 'MI',
    '-tex-oldstyle': 'C',
    '-tex-bold-oldstyle': 'CB',
    '-tex-variant': 'A'
  };

  /**
   *  The stretchy delimiter data
   */
  protected static defaultDelimiters: DelimiterMap<ChtmlDelimiterData> = delimiters;

  /**
   *  The character data by variant
   */
  protected static defaultChars: CharMapMap<ChtmlCharOptions> = {
    'normal': normal,
    'bold': bold,
    'italic': italic,
    'bold-italic': boldItalic,
    'double-struck': doubleStruck,
    'fraktur': fraktur,
    'bold-fraktur': frakturBold,
    'script': script,
    'bold-script': scriptBold,
    'sans-serif': sansSerif,
    'bold-sans-serif': sansSerifBold,
    'sans-serif-italic': sansSerifItalic,
    'sans-serif-bold-italic': sansSerifBoldItalic,
    'monospace': monospace,
    '-smallop': smallop,
    '-largeop': largeop,
    '-size3': texSize3,
    '-size4': texSize4,
    '-tex-calligraphic': texCalligraphic,
    '-tex-bold-calligraphic': texCalligraphicBold,
    '-tex-mathit': texMathit,
    '-tex-oldstyle': texOldstyle,
    '-tex-bold-oldstyle': texOldstyleBold,
    '-tex-variant': texVariant
  };

  /*=====================================================*/
  /**
   * The CSS styles needed for this font.
   */
  protected static defaultStyles = {
    ...ChtmlFontData.defaultStyles,

    '.TEX-N': {
      'font-family': 'MJXZERO, MJXTEX'
    },

    '.TEX-B': {
      'font-family': 'MJXZERO, MJXTEX-B'
    },

    '.TEX-I': {
      'font-family': 'MJXZERO, MJXTEX-I'
    },

    '.TEX-MI': {
      'font-family': 'MJXZERO, MJXTEX-MI'
    },

    '.TEX-BI': {
      'font-family': 'MJXZERO, MJXTEX-BI'
    },

    '.TEX-S1': {
      'font-family': 'MJXZERO, MJXTEX-S1'
    },

    '.TEX-S2': {
      'font-family': 'MJXZERO, MJXTEX-S2'
    },

    '.TEX-S3': {
      'font-family': 'MJXZERO, MJXTEX-S3'
    },

    '.TEX-S4': {
      'font-family': 'MJXZERO, MJXTEX-S4'
    },

    '.TEX-A': {
      'font-family': 'MJXZERO, MJXTEX-A'
    },

    '.TEX-C': {
      'font-family': 'MJXZERO, MJXTEX-C'
    },

    '.TEX-CB': {
      'font-family': 'MJXZERO, MJXTEX-CB'
    },

    '.TEX-FR': {
      'font-family': 'MJXZERO, MJXTEX-FR'
    },

    '.TEX-FRB': {
      'font-family': 'MJXZERO, MJXTEX-FRB'
    },

    '.TEX-SS': {
      'font-family': 'MJXZERO, MJXTEX-SS'
    },

    '.TEX-SSB': {
      'font-family': 'MJXZERO, MJXTEX-SSB'
    },

    '.TEX-SSI': {
      'font-family': 'MJXZERO, MJXTEX-SSI'
    },

    '.TEX-SC': {
      'font-family': 'MJXZERO, MJXTEX-SC'
    },

    '.TEX-T': {
      'font-family': 'MJXZERO, MJXTEX-T'
    },

    '.TEX-V': {
      'font-family': 'MJXZERO, MJXTEX-V'
    },

    '.TEX-VB': {
      'font-family': 'MJXZERO, MJXTEX-VB'
    },

    'mjx-stretchy-v mjx-c, mjx-stretchy-h mjx-c': {
      'font-family': 'MJXZERO, MJXTEX-S1, MJXTEX-S4, MJXTEX, MJXTEX-A ! important'
    }
  };

  /**
   * The default @font-face declarations with %%URL%% where the font path should go
   */
  protected static defaultFonts = {
    ...ChtmlFontData.defaultFonts,

    '@font-face /* 1 */': {
      'font-family': 'MJXTEX',
      src: 'url("%%URL%%/MathJax_Main-Regular.woff") format("woff")'
    },

    '@font-face /* 2 */': {
      'font-family': 'MJXTEX-B',
      src: 'url("%%URL%%/MathJax_Main-Bold.woff") format("woff")'
    },

    '@font-face /* 3 */': {
      'font-family': 'MJXTEX-I',
      src: 'url("%%URL%%/MathJax_Math-Italic.woff") format("woff")'
    },

    '@font-face /* 4 */': {
      'font-family': 'MJXTEX-MI',
      src: 'url("%%URL%%/MathJax_Main-Italic.woff") format("woff")'
    },

    '@font-face /* 5 */': {
      'font-family': 'MJXTEX-BI',
      src: 'url("%%URL%%/MathJax_Math-BoldItalic.woff") format("woff")'
    },

    '@font-face /* 6 */': {
      'font-family': 'MJXTEX-S1',
      src: 'url("%%URL%%/MathJax_Size1-Regular.woff") format("woff")'
    },

    '@font-face /* 7 */': {
      'font-family': 'MJXTEX-S2',
      src: 'url("%%URL%%/MathJax_Size2-Regular.woff") format("woff")'
    },

    '@font-face /* 8 */': {
      'font-family': 'MJXTEX-S3',
      src: 'url("%%URL%%/MathJax_Size3-Regular.woff") format("woff")'
    },

    '@font-face /* 9 */': {
      'font-family': 'MJXTEX-S4',
      src: 'url("%%URL%%/MathJax_Size4-Regular.woff") format("woff")'
    },

    '@font-face /* 10 */': {
      'font-family': 'MJXTEX-A',
      src: 'url("%%URL%%/MathJax_AMS-Regular.woff") format("woff")'
    },

    '@font-face /* 11 */': {
      'font-family': 'MJXTEX-C',
      src: 'url("%%URL%%/MathJax_Calligraphic-Regular.woff") format("woff")'
    },

    '@font-face /* 12 */': {
      'font-family': 'MJXTEX-CB',
      src: 'url("%%URL%%/MathJax_Calligraphic-Bold.woff") format("woff")'
    },

    '@font-face /* 13 */': {
      'font-family': 'MJXTEX-FR',
      src: 'url("%%URL%%/MathJax_Fraktur-Regular.woff") format("woff")'
    },

    '@font-face /* 14 */': {
      'font-family': 'MJXTEX-FRB',
      src: 'url("%%URL%%/MathJax_Fraktur-Bold.woff") format("woff")'
    },

    '@font-face /* 15 */': {
      'font-family': 'MJXTEX-SS',
      src: 'url("%%URL%%/MathJax_SansSerif-Regular.woff") format("woff")'
    },

    '@font-face /* 16 */': {
      'font-family': 'MJXTEX-SSB',
      src: 'url("%%URL%%/MathJax_SansSerif-Bold.woff") format("woff")'
    },

    '@font-face /* 17 */': {
      'font-family': 'MJXTEX-SSI',
      src: 'url("%%URL%%/MathJax_SansSerif-Italic.woff") format("woff")'
    },

    '@font-face /* 18 */': {
      'font-family': 'MJXTEX-SC',
      src: 'url("%%URL%%/MathJax_Script-Regular.woff") format("woff")'
    },

    '@font-face /* 19 */': {
      'font-family': 'MJXTEX-T',
      src: 'url("%%URL%%/MathJax_Typewriter-Regular.woff") format("woff")'
    },

    '@font-face /* 20 */': {
      'font-family': 'MJXTEX-V',
      src: 'url("%%URL%%/MathJax_Vector-Regular.woff") format("woff")'
    },

    '@font-face /* 21 */': {
      'font-family': 'MJXTEX-VB',
      src: 'url("%%URL%%/MathJax_Vector-Bold.woff") format("woff")'
    },
  };

  /**
   * @override
   */
  public cssFontPrefix: string = 'TEX';

  /**
   * @override
   */
  protected getDelimiterData(n: number) {
    return this.getChar('-smallop', n) || this.getChar('-size4', n);
  }

}
