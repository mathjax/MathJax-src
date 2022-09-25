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
 * @fileoverview  Implements the ChtmlMrow wrapper for the MmlMrow object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTML} from '../../chtml.js';
import {ChtmlWrapper, ChtmlWrapperClass} from '../Wrapper.js';
import {ChtmlWrapperFactory} from '../WrapperFactory.js';
import {ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData,
        ChtmlFontData, ChtmlFontDataClass} from '../FontData.js';
import {CommonMrow, CommonMrowClass, CommonMrowMixin} from '../../common/Wrappers/mrow.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {CommonInferredMrow, CommonInferredMrowClass, CommonInferredMrowMixin} from '../../common/Wrappers/mrow.js';
import {MmlMrow, MmlInferredMrow} from '../../../core/MmlTree/MmlNodes/mrow.js';

/*****************************************************************/
/**
 * The ChtmlMrow interface for the CHTML Mrow wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMrowNTD<N, T, D> extends ChtmlWrapper<N, T, D>, CommonMrow<
  N, T, D,
  CHTML<N, T, D>, ChtmlWrapper<N, T, D>, ChtmlWrapperFactory<N, T, D>, ChtmlWrapperClass<N, T, D>,
  ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData, ChtmlFontData, ChtmlFontDataClass
> {}

/**
 * The ChtmlMrowClass interface for the CHTML Mrow wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMrowClass<N, T, D> extends ChtmlWrapperClass<N, T, D>, CommonMrowClass<
  N, T, D,
  CHTML<N, T, D>, ChtmlWrapper<N, T, D>, ChtmlWrapperFactory<N, T, D>, ChtmlWrapperClass<N, T, D>,
  ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData, ChtmlFontData, ChtmlFontDataClass
> {
  new(factory: ChtmlWrapperFactory<N, T, D>, node: MmlNode, parent?: ChtmlWrapper<N, T, D>): ChtmlMrowNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The ChtmlMrow wrapper class for the MmlMrow class
 */
export const ChtmlMrow = (function <N, T, D>(): ChtmlMrowClass<N, T, D> {

  const Base = CommonMrowMixin<
      N, T, D,
      CHTML<N, T, D>, ChtmlWrapper<N, T, D>, ChtmlWrapperFactory<N, T, D>, ChtmlWrapperClass<N, T, D>,
      ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData, ChtmlFontData, ChtmlFontDataClass,
      ChtmlMrowClass<N, T, D>
    >(ChtmlWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be ChtmlWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class ChtmlMrow extends Base implements ChtmlMrowNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMrow.prototype.kind;

    /**
     * @override
     */
    public toCHTML(parent: N) {
      const chtml = (this.node.isInferred ? (this.dom = parent) : this.standardChtmlNode(parent));
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
          this.adaptor.setStyle(chtml, 'width', this.em(Math.max(0, w + .001)));
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
 * The ChtmlInferredMrow interface for the CHTML InferredMrow wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlInferredMrowNTD<N, T, D> extends ChtmlMrowNTD<N, T, D>, CommonInferredMrow<
  N, T, D,
  CHTML<N, T, D>, ChtmlWrapper<N, T, D>, ChtmlWrapperFactory<N, T, D>, ChtmlWrapperClass<N, T, D>,
  ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData, ChtmlFontData, ChtmlFontDataClass
> {}

/**
 * The ChtmlInferredMrowClass interface for the CHTML InferredMrow wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlInferredMrowClass<N, T, D> extends ChtmlMrowClass<N, T, D>, CommonInferredMrowClass<
  N, T, D,
  CHTML<N, T, D>, ChtmlWrapper<N, T, D>, ChtmlWrapperFactory<N, T, D>, ChtmlWrapperClass<N, T, D>,
  ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData, ChtmlFontData, ChtmlFontDataClass
> {
  new(factory: ChtmlWrapperFactory<N, T, D>, node: MmlNode, parent?: ChtmlWrapper<N, T, D>): ChtmlInferredMrowNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The ChtmlInferredMrow wrapper class for the MmlInferredMrow class
 */
export const ChtmlInferredMrow = (function <N, T, D>(): ChtmlInferredMrowClass<N, T, D> {

  const Base = CommonInferredMrowMixin<
      N, T, D,
      CHTML<N, T, D>, ChtmlWrapper<N, T, D>, ChtmlWrapperFactory<N, T, D>, ChtmlWrapperClass<N, T, D>,
      ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData, ChtmlFontData, ChtmlFontDataClass,
      ChtmlInferredMrowClass<N, T, D>
    >(ChtmlMrow);

  // Avoid message about base constructors not having the same type
  //   (they should both be ChtmlWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class ChtmlInferredMrow extends Base implements ChtmlInferredMrowNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlInferredMrow.prototype.kind;

  };

})<any, any, any>();
