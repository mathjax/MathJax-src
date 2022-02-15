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
 * @fileoverview  Implements the CHTMLHtmlNode wrapper for the HtmlNode object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVGWrapper, SVGConstructor} from '../Wrapper.js';
import {CommonHtmlNodeMixin} from '../../common/Wrappers/HtmlNode.js';
import {HtmlNode} from '../../../core/MmlTree/MmlNodes/HtmlNode.js';
import {StyleList} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 * The SVGhtmlNode wrapper for the HtmlNode object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class SVGHtmlNode<N, _T, _D> extends CommonHtmlNodeMixin<any, SVGConstructor<any, any, any>>(SVGWrapper) {

  /**
   * The html wrapper
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
    this.element = this.adaptor.append(parent, this.svg('foreignObject', {
      'data-mjx-html': true,
      y: this.jax.fixed(-h * em) + 'px',
      width: this.jax.fixed(w * em) + 'px',
      height: this.jax.fixed((h + d) * em) + 'px',
      transform: `scale(${scale}) matrix(1 0 0 -1 0 0)`
    }, [this.getHTML()]));
  }

}
