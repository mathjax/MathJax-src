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
 * @file  Implements the SvgMphantom wrapper for the MmlMphantom object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMphantom } from '../../../core/MmlTree/MmlNodes/mphantom.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The SvgMphantom interface for the SVG Mphantom wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMphantomNTD<
  DOM extends DOM_TYPES,
> extends SvgWrapper<DOM> {}

/**
 * The SvgMphantomClass interface for the SVG Mphantom wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMphantomClass<
  DOM extends DOM_TYPES,
> extends SvgWrapperClass<DOM> {
  new (
    factory: SvgWrapperFactory<DOM>,
    node: MmlNode,
    parent?: SvgWrapper<DOM>
  ): SvgMphantomNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgMphantom wrapper class for the MmlMphantom class
 */
export class SvgMphantom
  extends SvgWrapper<DOM>
  implements SvgMphantomNTD<DOM>
{
  /**
   * @override
   */
  public static kind = MmlMphantom.prototype.kind;

  /**
   * @override
   */
  public toSVG(parents: N<DOM>[]) {
    this.standardSvgNodes(parents);
  }
}
