/*************************************************************
 *
 *  Copyright (c) 2019-2022 The MathJax Consortium
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
 * @fileoverview  Implements the SvgMtext wrapper for the MmlMtext object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVG} from '../../svg.js';
import {SvgWrapper, SvgWrapperClass} from '../Wrapper.js';
import {SvgWrapperFactory} from '../WrapperFactory.js';
import {SvgCharOptions, SvgVariantData, SvgDelimiterData, SvgFontData, SvgFontDataClass} from '../FontData.js';
import {CommonMtext, CommonMtextClass, CommonMtextMixin} from '../../common/Wrappers/mtext.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlMtext} from '../../../core/MmlTree/MmlNodes/mtext.js';

/*****************************************************************/
/**
 * The SvgMtext interface for the SVG Mtext wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMtextNTD<N, T, D> extends SvgWrapper<N, T, D>, CommonMtext<
  N, T, D,
  SVG<N, T, D>, SvgWrapper<N, T, D>, SvgWrapperFactory<N, T, D>, SvgWrapperClass<N, T, D>,
  SvgCharOptions, SvgVariantData, SvgDelimiterData, SvgFontData, SvgFontDataClass
> {}

/**
 * The SvgMtextClass interface for the SVG Mtext wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMtextClass<N, T, D> extends SvgWrapperClass<N, T, D>, CommonMtextClass<
  N, T, D,
  SVG<N, T, D>, SvgWrapper<N, T, D>, SvgWrapperFactory<N, T, D>, SvgWrapperClass<N, T, D>,
  SvgCharOptions, SvgVariantData, SvgDelimiterData, SvgFontData, SvgFontDataClass
> {
  new(factory: SvgWrapperFactory<N, T, D>, node: MmlNode, parent?: SvgWrapper<N, T, D>): SvgMtextNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SvgMtext wrapper class for the MmlMtext class
 */
export const SvgMtext = (function <N, T, D>(): SvgMtextClass<N, T, D> {

  const Base = CommonMtextMixin<
      N, T, D,
      SVG<N, T, D>, SvgWrapper<N, T, D>, SvgWrapperFactory<N, T, D>, SvgWrapperClass<N, T, D>,
      SvgCharOptions, SvgVariantData, SvgDelimiterData, SvgFontData, SvgFontDataClass,
      SvgMtextClass<N, T, D>
    >(SvgWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be SvgWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SvgMtext extends Base implements SvgMtextNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMtext.prototype.kind;

  };

})<any, any, any>();
