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
 * @file  Implements the SvgMn wrapper for the MmlMn object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG, SVG_FONT } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMn,
  CommonMnClass,
  CommonMnMixin,
} from '../../common/Wrappers/mn.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMn } from '../../../core/MmlTree/MmlNodes/mn.js';
import { DOM, DOM_TYPES } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The SvgMn interface for the SVG Mn wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMnNTD<DOM extends DOM_TYPES>
  extends
    SvgWrapper<DOM>,
    CommonMn<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgMnClass interface for the SVG Mn wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMnClass<DOM extends DOM_TYPES>
  extends
    SvgWrapperClass<DOM>,
    CommonMnClass<
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
  ): SvgMnNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgMn wrapper class for the MmlMn class
 */
export const SvgMn = (function (): SvgMnClass<DOM> {
  const Base = CommonMnMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgMnClass<DOM>
  >(SvgWrapper);

  return class SvgMn extends Base implements SvgMnNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMn.prototype.kind;
  };
})();
