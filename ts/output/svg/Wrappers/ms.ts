/*************************************************************
 *
 *  Copyright (c) 2018-2025 The MathJax Consortium
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
 * @file  Implements the SvgMs wrapper for the MmlMs object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  SvgCharOptions,
  SvgVariantData,
  SvgDelimiterData,
  SvgFontData,
  SvgFontDataClass,
} from '../FontData.js';
import {
  CommonMs,
  CommonMsClass,
  CommonMsMixin,
} from '../../common/Wrappers/ms.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMs } from '../../../core/MmlTree/MmlNodes/ms.js';

/*****************************************************************/
/**
 * The SvgMs interface for the SVG Ms wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMsNTD<N, T, D>
  extends SvgWrapper<N, T, D>,
    CommonMs<
      N,
      T,
      D,
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass
    > {}

/**
 * The SvgMsClass interface for the SVG Ms wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMsClass<N, T, D>
  extends SvgWrapperClass<N, T, D>,
    CommonMsClass<
      N,
      T,
      D,
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass
    > {
  new (
    factory: SvgWrapperFactory<N, T, D>,
    node: MmlNode,
    parent?: SvgWrapper<N, T, D>
  ): SvgMsNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgMs wrapper class for the MmlMs class
 */
export const SvgMs = (function <N, T, D>(): SvgMsClass<N, T, D> {
  const Base = CommonMsMixin<
    N,
    T,
    D,
    SVG<N, T, D>,
    SvgWrapper<N, T, D>,
    SvgWrapperFactory<N, T, D>,
    SvgWrapperClass<N, T, D>,
    SvgCharOptions,
    SvgVariantData,
    SvgDelimiterData,
    SvgFontData,
    SvgFontDataClass,
    SvgMsClass<N, T, D>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be SvgWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class SvgMs extends Base implements SvgMsNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMs.prototype.kind;
  };
})<any, any, any>();
