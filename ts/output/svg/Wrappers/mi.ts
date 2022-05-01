/*************************************************************
 *
 *  Copyright (c) 2018-2022 The MathJax Consortium
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
 * @fileoverview  Implements the SVGmi wrapper for the MmlMi object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVG} from '../../svg.js';
import {SVGWrapper, SVGWrapperClass} from '../Wrapper.js';
import {SVGWrapperFactory} from '../WrapperFactory.js';
import {SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass} from '../FontData.js';
import {CommonMi, CommonMiClass, CommonMiMixin} from '../../common/Wrappers/mi.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlMi} from '../../../core/MmlTree/MmlNodes/mi.js';

/*****************************************************************/
/**
 * The SVGMi interface for the SVG Mi wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMiNTD<N, T, D> extends SVGWrapper<N, T, D>, CommonMi<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {}

/**
 * The SVGMiClass interface for the SVG Mi wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMiClass<N, T, D> extends SVGWrapperClass<N, T, D>, CommonMiClass<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {
  new(factory: SVGWrapperFactory<N, T, D>, node: MmlNode, parent?: SVGWrapper<N, T, D>): SVGMiNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SVGMi wrapper class for the MmlMi class
 */
export const SVGMi = (function <N, T, D>(): SVGMiClass<N, T, D> {

  const Base = CommonMiMixin<
      N, T, D,
      SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
      SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass,
      SVGMiClass<N, T, D>
    >(SVGWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be SVGWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SVGMi extends Base implements SVGMiNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMi.prototype.kind;

  };

})<any, any, any>();
