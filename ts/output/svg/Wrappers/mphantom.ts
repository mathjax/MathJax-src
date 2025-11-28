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
 * @file  Implements the SvgMphantom wrapper for the MmlMphantom object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMphantom } from '../../../core/MmlTree/MmlNodes/mphantom.js';

/*****************************************************************/
/**
 * The SvgMphantom interface for the SVG Mphantom wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMphantomNTD<N, T, D> extends SvgWrapper<N, T, D> {}

/**
 * The SvgMphantomClass interface for the SVG Mphantom wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMphantomClass<N, T, D> extends SvgWrapperClass<N, T, D> {
  new (
    factory: SvgWrapperFactory<N, T, D>,
    node: MmlNode,
    parent?: SvgWrapper<N, T, D>
  ): SvgMphantomNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgMphantom wrapper class for the MmlMphantom class
 */
export const SvgMphantom = (function <N, T, D>(): SvgMphantomClass<N, T, D> {
  return class SvgMphantom
    extends SvgWrapper<N, T, D>
    implements SvgMphantomNTD<N, T, D>
  {
    /**
     * @override
     */
    public static kind = MmlMphantom.prototype.kind;

    /**
     * @override
     */
    public toSVG(parents: N[]) {
      this.standardSvgNodes(parents);
    }
  };
})<any, any, any>();
