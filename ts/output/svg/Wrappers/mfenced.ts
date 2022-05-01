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
 * @fileoverview  Implements the SVGmfenced wrapper for the MmlMfenced object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVG} from '../../svg.js';
import {SVGWrapper, SVGWrapperClass} from '../Wrapper.js';
import {SVGWrapperFactory} from '../WrapperFactory.js';
import {SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass} from '../FontData.js';
import {CommonMfenced, CommonMfencedClass, CommonMfencedMixin} from '../../common/Wrappers/Mfenced.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlMfenced} from '../../../core/MmlTree/MmlNodes/mfenced.js';
import {SVGInferredMrowNTD} from './mrow.js';

/*****************************************************************/
/**
 * The SVGMfenced interface for the SVG mfenced wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMfencedNTD<N, T, D> extends SVGWrapper<N, T, D>, CommonMfenced<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {}

/**
 * The SVGMfencedClass interface for the SVG mfenced wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMfencedClass<N, T, D> extends SVGWrapperClass<N, T, D>, CommonMfencedClass<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {
  new(factory: SVGWrapperFactory<N, T, D>, node: MmlNode, parent?: SVGWrapper<N, T, D>): SVGMfencedNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SVGMfenced wrapper class for the MmlMfenced class
 */
export const SVGMfenced = (function <N, T, D>(): SVGMfencedClass<N, T, D> {

  const Base = CommonMfencedMixin<
      N, T, D,
      SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
      SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass,
      SVGMfencedClass<N, T, D>
    >(SVGWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be SVGWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SVGMfenced extends Base implements SVGMfencedNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMfenced.prototype.kind;

    /**
     * An mrow used to render the result
     */
    public mrow: SVGInferredMrowNTD<N, T, D>;

    /**
     * @override
     */
    public toSVG(parent: N) {
      const svg = this.standardSVGnode(parent);
      this.setChildrenParent(this.mrow);  // temporarily change parents to the mrow
      this.mrow.toSVG(svg);
      this.setChildrenParent(this);       // put back the correct parents
    }

    /**
     * @param {SVGWrapper} parent   The parent to use for the fenced children
     */
    protected setChildrenParent(parent: SVGWrapper<N, T, D>) {
      for (const child of this.childNodes) {
        child.parent = parent;
      }
    }

  };

})<any, any, any>();
