/*************************************************************
 *
 *  Copyright (c) 2022 The MathJax Consortium
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
 * @fileoverview  Implements the ChtmlHtmlNode wrapper for the HtmlNode object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTML} from '../../chtml.js';
import {ChtmlWrapper, ChtmlWrapperClass} from '../Wrapper.js';
import {ChtmlWrapperFactory} from '../WrapperFactory.js';
import {ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData,
        ChtmlFontData, ChtmlFontDataClass} from '../FontData.js';
import {CommonHtmlNode, CommonHtmlNodeClass, CommonHtmlNodeMixin} from '../../common/Wrappers/HtmlNode.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {HtmlNode} from '../../../core/MmlTree/MmlNodes/HtmlNode.js';
import {StyleList as StyleList} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 * The ChtmlHtmlNode interface for the CHTML HtmlNode wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlHtmlNodeNTD<N, T, D> extends ChtmlWrapper<N, T, D>, CommonHtmlNode<
  N, T, D,
  CHTML<N, T, D>, ChtmlWrapper<N, T, D>, ChtmlWrapperFactory<N, T, D>, ChtmlWrapperClass<N, T, D>,
  ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData, ChtmlFontData, ChtmlFontDataClass
> {}

/**
 * The ChtmlHtmlNodeClass interface for the CHTML HtmlNode wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlHtmlNodeClass<N, T, D> extends ChtmlWrapperClass<N, T, D>, CommonHtmlNodeClass<
  N, T, D,
  CHTML<N, T, D>, ChtmlWrapper<N, T, D>, ChtmlWrapperFactory<N, T, D>, ChtmlWrapperClass<N, T, D>,
  ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData, ChtmlFontData, ChtmlFontDataClass
> {
  new(factory: ChtmlWrapperFactory<N, T, D>, node: MmlNode, parent?: ChtmlWrapper<N, T, D>): ChtmlHtmlNodeNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The ChtmlHtmlNode wrapper class for the MmlHtmlNode class
 */
export const ChtmlHtmlNode = (function <N, T, D>(): ChtmlHtmlNodeClass<N, T, D> {

  const Base = CommonHtmlNodeMixin<
      N, T, D,
      CHTML<N, T, D>, ChtmlWrapper<N, T, D>, ChtmlWrapperFactory<N, T, D>, ChtmlWrapperClass<N, T, D>,
      ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData, ChtmlFontData, ChtmlFontDataClass,
      ChtmlHtmlNodeClass<N, T, D>
    >(ChtmlWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be ChtmlWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class ChtmlHtmlNode extends Base implements ChtmlHtmlNodeNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = HtmlNode.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleList = {
      'mjx-html': {
        'line-height': 'normal',
        'text-align': 'initial'
      },
      'mjx-html-holder': {
        display: 'block',
        position: 'absolute',
        width: '100%',
        height: '100%'
      }
    };

    /**
     * @override
     */
    public toCHTML(parent: N) {
      this.markUsed();
      this.dom = this.adaptor.append(parent, this.getHTML()) as N;
    }

  };

})<any, any, any>();
