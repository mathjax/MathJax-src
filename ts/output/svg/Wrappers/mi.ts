/*************************************************************
 *
 *  Copyright (c) 2018-2026 The MathJax Consortium
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
 * @file  Implements the SvgMi wrapper for the MmlMi object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG, SVG_FONT } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMi,
  CommonMiClass,
  CommonMiMixin,
} from '../../common/Wrappers/mi.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMi } from '../../../core/MmlTree/MmlNodes/mi.js';
import { DOM, DOM_TYPES } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The SvgMi interface for the SVG Mi wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMiNTD<DOM extends DOM_TYPES>
  extends
    SvgWrapper<DOM>,
    CommonMi<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgMiClass interface for the SVG Mi wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMiClass<DOM extends DOM_TYPES>
  extends
    SvgWrapperClass<DOM>,
    CommonMiClass<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {
  new (
    factory: SvgWrapperFactory<DOM>,
    node: MmlNode,
    parent?: SvgWrapper<DOM>
  ): SvgMiNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgMi wrapper class for the MmlMi class
 */
export const SvgMi = (function (): SvgMiClass<DOM> {
  const Base = CommonMiMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgMiClass<DOM>
  >(SvgWrapper);

  return class SvgMi extends Base implements SvgMiNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMi.prototype.kind;
  };
})();
