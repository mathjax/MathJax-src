/*************************************************************
 *
 *  Copyright (c) 2020 The MathJax Consortium
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
 * @fileoverview  The MathJax STIX2Font object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {FontDataClass, CharOptions, VariantData, DelimiterData, CssFontMap} from '../FontData.js';

/*****************************************************************/
/**
 *  The CommonSTIX2Font mixin for the CommonSTIX2Font object
 *
 * @template C  The CharOptions class for this font
 * @template V  The VariantData class for this font
 * @template B  The FontData class to extend
 */
export function CommonSTIX2FontMixin<
  C extends CharOptions,
  V extends VariantData<C>,
  D extends DelimiterData,
  B extends FontDataClass<C, V, D>
>(Base: B): FontDataClass<C, V, D> & B {

  return class extends Base {

    /**
     *  Add the extra variants for the STIX2 fonts
     */
    protected static defaultVariants = [
      ...Base.defaultVariants,
      ['-smallop', 'normal'],
      ['-largeop', 'normal'],
      ['-size3', 'normal'],
      ['-size4', 'normal'],
      ['-size7', 'normal'],
      ['-size8', 'normal'],
      ['-size9', 'normal'],
      ['-size10', 'normal'],
      ['-size11', 'normal'],
      ['-size12', 'normal'],
      ['-tex-calligraphic', 'italic'],
      ['-tex-bold-calligraphic', 'bold-italic'],
      ['-tex-oldstyle', 'normal'],
      ['-tex-bold-oldstyle', 'bold'],
      ['-tex-mathit', 'italic'],
      ['-tex-variant', 'normal'],
      ['-extend', 'normal'],
      ['-double-struck-italic', 'bold-italic']
    ];

    /**
     * The data used for CSS for undefined characters for each variant
     */
    protected static defaultCssFonts: CssFontMap = {
      ...Base.defaultCssFonts,
      '-smallop': ['serif', false, false],
      '-largeop': ['serif', false, false],
      '-size3': ['serif', false, false],
      '-size4': ['serif', false, false],
      '-size5': ['serif', false, false],
      '-size6': ['serif', false, false],
      '-size7': ['serif', false, false],
      '-size8': ['serif', false, false],
      '-size9': ['serif', false, false],
      '-size10': ['serif', false, false],
      '-size11': ['serif', false, false],
      '-size12': ['serif', false, false],
      '-tex-calligraphic': ['cursive', true, false],
      '-tex-bold-calligraphic': ['cursive', true, true],
      '-tex-oldstyle': ['serif', false, false],
      '-tex-bold-oldstyle': ['serif', false, true],
      '-tex-mathit': ['serif', true, false],
      '-tex-variant': ['serif', false, false],
      '-extend': ['serif', false, false],
      '-double-struck-italic': ['serif', true, true]
    };

    /**
     *  The default variants for the standard stretchy sizes
     */
    protected static defaultSizeVariants = [
      'normal', '-smallop', '-largeop',
      '-size3', '-size4', '-size5', '-size6', '-size7',
      '-size8', '-size9', '-size10', '-size11', '-size12'];

    /**
     * @override
     */
    protected getDelimiterData(n: number) {
      return this.getChar('-smallop', n) || this.getChar('-size4', n);
    }

  };

}

