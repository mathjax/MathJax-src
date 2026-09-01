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
 * @file  Implements the SvgMspace wrapper for the MmlMspace object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG, SVG_FONT } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMspace,
  CommonMspaceClass,
  CommonMspaceMixin,
} from '../../common/Wrappers/mspace.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMspace } from '../../../core/MmlTree/MmlNodes/mspace.js';
import { DOM, DOM_TYPES } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The SvgMspace interface for the SVG Mspace wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMspaceNTD<DOM extends DOM_TYPES>
  extends
    SvgWrapper<DOM>,
    CommonMspace<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgMspaceClass interface for the SVG Mspace wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMspaceClass<DOM extends DOM_TYPES>
  extends
    SvgWrapperClass<DOM>,
    CommonMspaceClass<
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
  ): SvgMspaceNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgMspace wrapper class for the MmlMspace class
 */
export const SvgMspace = (function (): SvgMspaceClass<DOM> {
  const Base = CommonMspaceMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgMspaceClass<DOM>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class SvgMspace extends Base implements SvgMspaceNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMspace.prototype.kind;
  };
})();
