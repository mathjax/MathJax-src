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
 * @fileoverview  Implements the SVGTeXAtom wrapper for the MmlTeXAtom object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVG} from '../../svg.js';
import {SVGWrapper, SVGWrapperClass} from '../Wrapper.js';
import {SVGWrapperFactory} from '../WrapperFactory.js';
import {SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass} from '../FontData.js';
import {CommonTeXAtom, CommonTeXAtomClass, CommonTeXAtomMixin} from '../../common/Wrappers/TeXAtom.js';
import {TeXAtom} from '../../../core/MmlTree/MmlNodes/TeXAtom.js';
import {MmlNode, TEXCLASS, TEXCLASSNAMES} from '../../../core/MmlTree/MmlNode.js';

/*****************************************************************/
/**
 * The SVGTeXAtom interface for the SVG TeXAtom wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGTeXAtomNTD<N, T, D> extends SVGWrapper<N, T, D>, CommonTeXAtom<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {}

/**
 * The SVGTeXAtomClass interface for the SVG TeXAtom wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGTeXAtomClass<N, T, D> extends SVGWrapperClass<N, T, D>, CommonTeXAtomClass<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {
  new(factory: SVGWrapperFactory<N, T, D>, node: MmlNode, parent?: SVGWrapper<N, T, D>): SVGTeXAtomNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SVGTeXAtom wrapper for the MmlTeXAtom class
 */
export const SVGTeXAtom = (function <N, T, D>(): SVGTeXAtomClass<N, T, D> {

  const Base = CommonTeXAtomMixin<
      N, T, D,
      SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
      SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass,
      SVGTeXAtomClass<N, T, D>
    >(SVGWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be SVGWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SVGTeXAtom extends Base implements SVGTeXAtomNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = TeXAtom.prototype.kind;

    /**
     * @override
     */
    public toSVG(parent: N) {
      super.toSVG(parent);
      this.adaptor.setAttribute(this.dom, 'data-mjx-texclass', TEXCLASSNAMES[this.node.texClass]);
      //
      // Center VCENTER atoms vertically
      //
      if (this.node.texClass === TEXCLASS.VCENTER) {
        const bbox = this.childNodes[0].getBBox();  // get unmodified bbox of children
        const {h, d} = bbox;
        const a = this.font.params.axis_height;
        const dh = ((h + d) / 2 + a) - h;  // new height minus old height
        const translate = 'translate(0 ' + this.fixed(dh) + ')';
        this.adaptor.setAttribute(this.dom, 'transform', translate);
      }
    }

  } as any as SVGTeXAtomClass<N, T, D>;

})<any, any, any>();
