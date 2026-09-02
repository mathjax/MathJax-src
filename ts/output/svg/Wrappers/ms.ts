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
 * @file  Implements the SvgMs wrapper for the MmlMs object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG, SVG_FONT } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMs,
  CommonMsClass,
  CommonMsMixin,
} from '../../common/Wrappers/ms.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMs } from '../../../core/MmlTree/MmlNodes/ms.js';
import { DOM, DOM_TYPES } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The SvgMs interface for the SVG Ms wrapper
 *
 * @template DOM   The DOM nodes
 */
export interface SvgMsNTD<DOM extends DOM_TYPES>
  extends
    SvgWrapper<DOM>,
    CommonMs<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgMsClass interface for the SVG Ms wrapper
 *
 * @template DOM   The DOM nodes
 */
export interface SvgMsClass<DOM extends DOM_TYPES>
  extends
    SvgWrapperClass<DOM>,
    CommonMsClass<
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
  ): SvgMsNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgMs wrapper class for the MmlMs class
 */
export const SvgMs = (function (): SvgMsClass<DOM> {
  const Base = CommonMsMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgMsClass<DOM>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class SvgMs extends Base implements SvgMsNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMs.prototype.kind;
  };
})();
