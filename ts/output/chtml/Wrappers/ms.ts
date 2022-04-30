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
 * @fileoverview  Implements the CHTMLms wrapper for the MmlMs object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTML} from '../../chtml.js';
import {CHTMLWrapper, CHTMLWrapperClass} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData,
        CHTMLFontData, CHTMLFontDataClass} from '../FontData.js';
import {CommonMs, CommonMsClass, CommonMsMixin} from '../../common/Wrappers/ms.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlMs} from '../../../core/MmlTree/MmlNodes/ms.js';

/*****************************************************************/
/**
 * The CHTMLMs interface for the CHTML Ms wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMsNTD<N, T, D> extends CHTMLWrapper<N, T, D>, CommonMs<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {}

/**
 * The CHTMLMsClass interface for the CHTML Ms wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMsClass<N, T, D> extends CHTMLWrapperClass<N, T, D>, CommonMsClass<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {
  new(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent?: CHTMLWrapper<N, T, D>): CHTMLMsNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The CHTMLMs wrapper class for the MmlMs class
 */
export const CHTMLMs = (function <N, T, D>(): CHTMLMsClass<N, T, D> {

  const Base = CommonMsMixin<
      N, T, D,
      CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
      CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass,
      CHTMLMsClass<N, T, D>
    >(CHTMLWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be CHTMLWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class CHTMLMs extends Base implements CHTMLMsNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMs.prototype.kind;

  };

})<any, any, any>();
