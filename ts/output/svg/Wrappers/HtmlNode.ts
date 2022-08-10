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
 * @fileoverview  Implements the SvgHtmlNode wrapper for the HtmlNode object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVG} from '../../svg.js';
import {SvgWrapper, SvgWrapperClass} from '../Wrapper.js';
import {SvgWrapperFactory} from '../WrapperFactory.js';
import {SvgCharOptions, SvgVariantData, SvgDelimiterData, SvgFontData, SvgFontDataClass} from '../FontData.js';
import {CommonHtmlNode, CommonHtmlNodeClass, CommonHtmlNodeMixin} from '../../common/Wrappers/HtmlNode.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {HtmlNode} from '../../../core/MmlTree/MmlNodes/HtmlNode.js';
import {StyleList} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 * The SvgHtmlNode interface for the SVG HtmlNode wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgHtmlNodeNTD<N, T, D> extends SvgWrapper<N, T, D>, CommonHtmlNode<
  N, T, D,
  SVG<N, T, D>, SvgWrapper<N, T, D>, SvgWrapperFactory<N, T, D>, SvgWrapperClass<N, T, D>,
  SvgCharOptions, SvgVariantData, SvgDelimiterData, SvgFontData, SvgFontDataClass
> {}

/**
 * The SvgHtmlNodeClass interface for the SVG HtmlNode wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgHtmlNodeClass<N, T, D> extends SvgWrapperClass<N, T, D>, CommonHtmlNodeClass<
  N, T, D,
  SVG<N, T, D>, SvgWrapper<N, T, D>, SvgWrapperFactory<N, T, D>, SvgWrapperClass<N, T, D>,
  SvgCharOptions, SvgVariantData, SvgDelimiterData, SvgFontData, SvgFontDataClass
> {
  new(factory: SvgWrapperFactory<N, T, D>, node: MmlNode, parent?: SvgWrapper<N, T, D>): SvgHtmlNodeNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SvgHtmlNode wrapper class for the MmlHtmlNode class
 */
export const SvgHtmlNode = (function <N, T, D>(): SvgHtmlNodeClass<N, T, D> {

  const Base = CommonHtmlNodeMixin<
      N, T, D,
      SVG<N, T, D>, SvgWrapper<N, T, D>, SvgWrapperFactory<N, T, D>, SvgWrapperClass<N, T, D>,
      SvgCharOptions, SvgVariantData, SvgDelimiterData, SvgFontData, SvgFontDataClass,
      SvgHtmlNodeClass<N, T, D>
    >(SvgWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be SvgWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SvgHtmlNode extends Base implements SvgHtmlNodeNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = HtmlNode.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleList = {
      'foreignObject[data-mjx-html]': {
        overflow: 'visible'
      },
      'mjx-html': {
        display: 'inline-block',
        'line-height': 'normal',
        'text-align': 'initial',
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
    public toSVG(parent: N) {
      const metrics = this.jax.math.metrics;
      const em = metrics.em * metrics.scale;
      const scale = this.fixed(1 / em);
      const {w, h, d} = this.getBBox();
      this.dom = this.adaptor.append(parent, this.svg('foreignObject', {
        'data-mjx-html': true,
        y: this.jax.fixed(-h * em) + 'px',
        width: this.jax.fixed(w * em) + 'px',
        height: this.jax.fixed((h + d) * em) + 'px',
        transform: `scale(${scale}) matrix(1 0 0 -1 0 0)`
      }, [this.getHTML()])) as N;
    }

  };

})<any, any, any>();
