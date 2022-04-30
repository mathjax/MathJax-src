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
 * @fileoverview  Implements the CHTMLmspace wrapper for the MmlMspace object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTML} from '../../chtml.js';
import {CHTMLWrapper, CHTMLWrapperClass} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData,
        CHTMLFontData, CHTMLFontDataClass} from '../FontData.js';
import {CommonMspace, CommonMspaceClass, CommonMspaceMixin} from '../../common/Wrappers/mspace.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlMspace} from '../../../core/MmlTree/MmlNodes/mspace.js';

/*****************************************************************/
/**
 * The CHTMLMspace interface for the CHTML Mspace wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMspaceNTD<N, T, D> extends CHTMLWrapper<N, T, D>, CommonMspace<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {}

/**
 * The CHTMLMspaceClass interface for the CHTML Mspace wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMspaceClass<N, T, D> extends CHTMLWrapperClass<N, T, D>, CommonMspaceClass<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {
  new(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent?: CHTMLWrapper<N, T, D>): CHTMLMspaceNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The CHTMLMspace wrapper class for the MmlMspace class
 */
export const CHTMLMspace = (function <N, T, D>(): CHTMLMspaceClass<N, T, D> {

  const Base = CommonMspaceMixin<
      N, T, D,
      CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
      CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass,
      CHTMLMspaceClass<N, T, D>
    >(CHTMLWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be CHTMLWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class CHTMLMspace extends Base implements CHTMLMspaceNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMspace.prototype.kind;

    /**
     * @override
     */
    public toCHTML(parent: N) {
      let chtml = this.standardCHTMLnode(parent);
      let {w, h, d} = this.getBBox();
      if (w < 0) {
        this.adaptor.setStyle(chtml, 'marginRight', this.em(w));
        w = 0;
      }
      if (w) {
        this.adaptor.setStyle(chtml, 'width', this.em(w));
      }
      h = Math.max(0, h + d);
      if (h) {
        this.adaptor.setStyle(chtml, 'height', this.em(Math.max(0, h)));
      }
      if (d) {
        this.adaptor.setStyle(chtml, 'verticalAlign', this.em(-d));
      }
    }

  };

})<any, any, any>();
