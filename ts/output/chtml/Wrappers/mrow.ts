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
 * @fileoverview  Implements the CHTMLmrow wrapper for the MmlMrow object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTML} from '../../chtml.js';
import {CHTMLWrapper, CHTMLWrapperClass} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData,
        CHTMLFontData, CHTMLFontDataClass} from '../FontData.js';
import {CommonMrow, CommonMrowClass, CommonMrowMixin} from '../../common/Wrappers/mrow.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {CommonInferredMrow, CommonInferredMrowClass, CommonInferredMrowMixin} from '../../common/Wrappers/mrow.js';
import {MmlMrow, MmlInferredMrow} from '../../../core/MmlTree/MmlNodes/mrow.js';

/*****************************************************************/
/**
 * The CHTMLMrow interface for the CHTML Mrow wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMrowNTD<N, T, D> extends CHTMLWrapper<N, T, D>, CommonMrow<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {}

/**
 * The CHTMLMrowClass interface for the CHTML Mrow wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMrowClass<N, T, D> extends CHTMLWrapperClass<N, T, D>, CommonMrowClass<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {
  new(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent?: CHTMLWrapper<N, T, D>): CHTMLMrowNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The CHTMLMrow wrapper class for the MmlMrow class
 */
export const CHTMLMrow = (function <N, T, D>(): CHTMLMrowClass<N, T, D> {

  const Base = CommonMrowMixin<
      N, T, D,
      CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
      CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass,
      CHTMLMrowClass<N, T, D>
    >(CHTMLWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be CHTMLWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class CHTMLMrow extends Base implements CHTMLMrowNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMrow.prototype.kind;

    /**
     * @override
     */
    public toCHTML(parent: N) {
      const chtml = (this.node.isInferred ? (this.chtml = parent) : this.standardCHTMLnode(parent));
      let hasNegative = false;
      for (const child of this.childNodes) {
        child.toCHTML(chtml);
        if (child.bbox.w < 0) {
          hasNegative = true;
        }
      }
      // FIXME:  handle line breaks
      if (hasNegative) {
        const {w} = this.getBBox();
        if (w) {
          this.adaptor.setStyle(chtml, 'width', this.em(Math.max(0, w)));
          if (w < 0) {
            this.adaptor.setStyle(chtml, 'marginRight', this.em(w));
          }
        }
      }
    }

  };

})<any, any, any>();


/*****************************************************************/
/*****************************************************************/

/**
 * The CHTMLInferredMrow interface for the CHTML InferredMrow wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLInferredMrowNTD<N, T, D> extends CHTMLMrowNTD<N, T, D>, CommonInferredMrow<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {}

/**
 * The CHTMLInferredMrowClass interface for the CHTML InferredMrow wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLInferredMrowClass<N, T, D> extends CHTMLMrowClass<N, T, D>, CommonInferredMrowClass<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {
  new(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent?: CHTMLWrapper<N, T, D>): CHTMLInferredMrowNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The CHTMLInferredMrow wrapper class for the MmlInferredMrow class
 */
export const CHTMLInferredMrow = (function <N, T, D>(): CHTMLInferredMrowClass<N, T, D> {

  const Base = CommonInferredMrowMixin<
      N, T, D,
      CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
      CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass,
      CHTMLInferredMrowClass<N, T, D>
    >(CHTMLMrow);

  // Avoid message about base constructors not having the same type
  //   (they should both be CHTMLWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class CHTMLInferredMrow extends Base implements CHTMLInferredMrowNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlInferredMrow.prototype.kind;

  };

})<any, any, any>();
