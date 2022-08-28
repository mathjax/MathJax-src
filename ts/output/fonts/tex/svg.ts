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

import {SvgFontData, SvgFontDataClass, SvgCharOptions, SvgVariantData, SvgDelimiterData,
        DelimiterMap, CharMapMap} from '../../svg/FontData.js';
import {CommonTeXFontMixin} from './common.js';
import {OptionList} from '../../../util/Options.js';

import {boldItalic} from './svg/bold-italic.js';
import {bold} from './svg/bold.js';
import {doubleStruck} from './svg/double-struck.js';
import {frakturBold} from './svg/fraktur-bold.js';
import {fraktur} from './svg/fraktur.js';
import {italic} from './svg/italic.js';
import {largeop} from './svg/largeop.js';
import {monospace} from './svg/monospace.js';
import {normal} from './svg/normal.js';
import {sansSerifBoldItalic} from './svg/sans-serif-bold-italic.js';
import {sansSerifBold} from './svg/sans-serif-bold.js';
import {sansSerifItalic} from './svg/sans-serif-italic.js';
import {sansSerif} from './svg/sans-serif.js';
import {scriptBold} from './svg/script-bold.js';
import {script} from './svg/script.js';
import {smallop} from './svg/smallop.js';
import {texCalligraphicBold} from './svg/tex-calligraphic-bold.js';
import {texCalligraphic} from './svg/tex-calligraphic.js';
import {texMathit} from './svg/tex-mathit.js';
import {texOldstyleBold} from './svg/tex-oldstyle-bold.js';
import {texOldstyle} from './svg/tex-oldstyle.js';
import {texSize3} from './svg/tex-size3.js';
import {texSize4} from './svg/tex-size4.js';
import {texVariant} from './svg/tex-variant.js';

import {delimiters} from './common/delimiters.js';

/***********************************************************************************/
/**
 *  The TeXFont class
 */


const Base = CommonTeXFontMixin<SvgCharOptions, SvgVariantData, SvgDelimiterData, SvgFontDataClass>(SvgFontData);

export class TeXFont extends Base {

  /**
   * @override
   */
  public static OPTIONS = {
    ...Base.OPTIONS,
    dynamicPrefix: Base.OPTIONS.dynamicPrefix + '/tex/dynamic'
  };

  /**
   *  The stretchy delimiter data
   */
  protected static defaultDelimiters: DelimiterMap<SvgDelimiterData> = delimiters;

  /**
   *  The character data by variant
   */
  protected static defaultChars: CharMapMap<SvgCharOptions> = {
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

  /**
   * The cacheIDs to use for the variants in font-caching
   */
  protected static variantCacheIds: {[name: string]: string} = {
    'normal': 'N',
    'bold': 'B',
    'italic': 'I',
    'bold-italic': 'BI',
    'double-struck': 'D',
    'fraktur': 'F',
    'bold-fraktur': 'BF',
    'script': 'S',
    'bold-script': 'BS',
    'sans-serif': 'SS',
    'bold-sans-serif': 'BSS',
    'sans-serif-italic': 'SSI',
    'sans-serif-bold-italic': 'SSBI',
    'monospace': 'M',
    '-smallop': 'SO',
    '-largeop': 'LO',
    '-size3': 'S3',
    '-size4': 'S4',
    '-tex-calligraphic': 'C',
    '-tex-bold-calligraphic': 'BC',
    '-tex-mathit': 'MI',
    '-tex-oldstyle': 'OS',
    '-tex-bold-oldstyle': 'BOS',
    '-tex-variant': 'V'
  };

  /**
   * @override
   */
  constructor(options: OptionList = null) {
    super(options);
    //
    //  Add the cacheIDs to the variants
    //
    const CLASS = this.constructor as typeof TeXFont;
    for (const variant of Object.keys(CLASS.variantCacheIds)) {
      this.variant[variant].cacheID = 'TEX-' + CLASS.variantCacheIds[variant];
    }
  }

}
