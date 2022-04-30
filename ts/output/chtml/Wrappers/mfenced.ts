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
 * @fileoverview  Implements the CHTMLmfenced wrapper for the MmlMfenced object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTML} from '../../chtml.js';
import {CHTMLWrapper, CHTMLWrapperClass} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData,
        CHTMLFontData, CHTMLFontDataClass} from '../FontData.js';
import {CommonMfenced, CommonMfencedClass, CommonMfencedMixin} from '../../common/Wrappers/mfenced.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlMfenced} from '../../../core/MmlTree/MmlNodes/mfenced.js';
import {CHTMLInferredMrowNTD} from './mrow.js';

/*****************************************************************/
/**
 * The CHTMLMfenced interface for the CHTML Mfenced wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMfencedNTD<N, T, D> extends CHTMLWrapper<N, T, D>, CommonMfenced<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {}

/**
 * The CHTMLMfencedClass interface for the CHTML Mfenced wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMfencedClass<N, T, D> extends CHTMLWrapperClass<N, T, D>, CommonMfencedClass<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {
  new(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent?: CHTMLWrapper<N, T, D>): CHTMLMfencedNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The CHTMLMfenced wrapper class for the MmlMfenced class
 */
export const CHTMLMfenced = (function <N, T, D>(): CHTMLMfencedClass<N, T, D> {

  const Base = CommonMfencedMixin<
      N, T, D,
      CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
      CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass,
      CHTMLMfencedClass<N, T, D>
    >(CHTMLWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be CHTMLWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class CHTMLMfenced extends Base implements CHTMLMfencedNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMfenced.prototype.kind;

    /**
     * @override
     */
    public toCHTML(parent: N) {
      const chtml = this.standardCHTMLnode(parent);
      (this.mrow as CHTMLInferredMrowNTD<N, T, D>).toCHTML(chtml);
    }

  };

})<any, any, any>();
