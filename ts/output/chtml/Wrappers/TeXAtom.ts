/*************************************************************
 *
 *  Copyright (c) 2017-2022 The MathJax Consortium
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
 * @fileoverview  Implements the CHTMLTeXAtom wrapper for the MmlTeXAtom object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTML} from '../../chtml.js';
import {CHTMLWrapper, CHTMLWrapperClass} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData,
        CHTMLFontData, CHTMLFontDataClass} from '../FontData.js';
import {CommonTeXAtom, CommonTeXAtomClass, CommonTeXAtomMixin} from '../../common/Wrappers/TeXAtom.js';
import {TeXAtom} from '../../../core/MmlTree/MmlNodes/TeXAtom.js';
import {MmlNode, TEXCLASS, TEXCLASSNAMES} from '../../../core/MmlTree/MmlNode.js';

/*****************************************************************/
/**
 * The CHTMLTeXAtom interface for the CHTML TeXAtom wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLTeXAtomNTD<N, T, D> extends CHTMLWrapper<N, T, D>, CommonTeXAtom<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {}

/**
 * The CHTMLTeXAtomClass interface for the CHTML TeXAtom wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLTeXAtomClass<N, T, D> extends CHTMLWrapperClass<N, T, D>, CommonTeXAtomClass<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {
  new(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent?: CHTMLWrapper<N, T, D>): CHTMLTeXAtomNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The CHTMLTeXAtom wrapper class for the MmlTeXAtom class
 */
export const CHTMLTeXAtom = (function <N, T, D>(): CHTMLTeXAtomClass<N, T, D> {

  const Base = CommonTeXAtomMixin<
      N, T, D,
      CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
      CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass,
      CHTMLTeXAtomClass<N, T, D>
    >(CHTMLWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be CHTMLWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class CHTMLTeXAtom extends Base implements CHTMLTeXAtomNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = TeXAtom.prototype.kind;

    /**
     * @override
     */
    public toCHTML(parent: N) {
      super.toCHTML(parent);
      this.adaptor.setAttribute(this.dom, 'texclass', TEXCLASSNAMES[this.node.texClass]);
      //
      // Center VCENTER atoms vertically
      //
      if (this.node.texClass === TEXCLASS.VCENTER) {
        const bbox = this.childNodes[0].getBBox();  // get unmodified bbox of children
        const {h, d} = bbox;
        const a = this.font.params.axis_height;
        const dh = ((h + d) / 2 + a) - h;  // new height minus old height
        this.adaptor.setStyle(this.dom, 'verticalAlign', this.em(dh));
      }
    }

  };

})<any, any, any>();
