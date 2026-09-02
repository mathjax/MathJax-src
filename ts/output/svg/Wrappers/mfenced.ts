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
 * @file  Implements the SvgMfenced wrapper for the MmlMfenced object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG, SVG_FONT } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMfenced,
  CommonMfencedClass,
  CommonMfencedMixin,
} from '../../common/Wrappers/mfenced.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMfenced } from '../../../core/MmlTree/MmlNodes/mfenced.js';
import { SvgInferredMrowNTD } from './mrow.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The SvgMfenced interface for the SVG mfenced wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMfencedNTD<DOM extends DOM_TYPES>
  extends
    SvgWrapper<DOM>,
    CommonMfenced<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgMfencedClass interface for the SVG mfenced wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMfencedClass<DOM extends DOM_TYPES>
  extends
    SvgWrapperClass<DOM>,
    CommonMfencedClass<
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
  ): SvgMfencedNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgMfenced wrapper class for the MmlMfenced class
 */
export const SvgMfenced = (function (): SvgMfencedClass<DOM> {
  const Base = CommonMfencedMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgMfencedClass<DOM>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class SvgMfenced extends Base implements SvgMfencedNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMfenced.prototype.kind;

    /**
     * An mrow used to render the result
     */
    public mrow: SvgInferredMrowNTD<DOM>;

    /**
     * @override
     */
    public toSVG(parents: N<DOM>[]) {
      const svg = this.standardSvgNodes(parents);
      this.setChildrenParent(this.mrow); // temporarily change parents to the mrow
      this.mrow.toSVG(svg);
      this.setChildrenParent(this); // put back the correct parents
    }

    /**
     * @param {SvgWrapper} parent   The parent to use for the fenced children
     */
    protected setChildrenParent(parent: SvgWrapper<DOM>) {
      for (const child of this.childNodes) {
        child.parent = parent;
      }
    }
  };
})();
