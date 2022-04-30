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
 * @fileoverview  Implements the CHTMLMroot wrapper for the MmlMroot object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTML} from '../../chtml.js';
import {CHTMLWrapper, CHTMLWrapperClass} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData,
        CHTMLFontData, CHTMLFontDataClass} from '../FontData.js';
import {CommonMroot, CommonMrootClass, CommonMrootMixin} from '../../common/Wrappers/mroot.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {CHTMLMsqrt, CHTMLMsqrtClass, CHTMLMsqrtNTD} from './msqrt.js';
import {BBox} from '../../../util/BBox.js';
import {MmlMroot} from '../../../core/MmlTree/MmlNodes/mroot.js';

/*****************************************************************/
/**
 * The CHTMLMroot interface for the CHTML Mroot wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMrootNTD<N, T, D> extends CHTMLMsqrtNTD<N, T, D>, CommonMroot<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {}

/**
 * The CHTMLMrootClass interface for the CHTML Mroot wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMrootClass<N, T, D> extends CHTMLMsqrtClass<N, T, D>, CommonMrootClass<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {
  new(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent?: CHTMLWrapper<N, T, D>): CHTMLMrootNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The CHTMLMroot wrapper class for the MmlMroot class
 */
export const CHTMLMroot = (function <N, T, D>(): CHTMLMrootClass<N, T, D> {

  const Base = CommonMrootMixin<
      N, T, D,
      CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
      CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass,
      CHTMLMrootClass<N, T, D>
    >(CHTMLMsqrt);

  // Avoid message about base constructors not having the same type
  //   (they should both be CHTMLWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class CHTMLMroot extends Base implements CHTMLMrootNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMroot.prototype.kind;

    /**
     * @override
     */
    protected addRoot(ROOT: N, root: CHTMLWrapper<N, T, D>, sbox: BBox, H: number) {
      root.toCHTML(ROOT);
      const [x, h, dx] = this.getRootDimens(sbox, H);
      this.adaptor.setStyle(ROOT, 'verticalAlign', this.em(h));
      this.adaptor.setStyle(ROOT, 'width', this.em(x));
      if (dx) {
        this.adaptor.setStyle(this.adaptor.firstChild(ROOT) as N, 'paddingLeft', this.em(dx));
      }
    }

  };


})<any, any, any>();
