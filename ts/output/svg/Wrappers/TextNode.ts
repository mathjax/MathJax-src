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
 * @fileoverview  Implements the SVGTextNode wrapper for the TextNode object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVG} from '../../svg.js';
import {SVGWrapper, SVGWrapperClass} from '../Wrapper.js';
import {SVGWrapperFactory} from '../WrapperFactory.js';
import {SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass} from '../FontData.js';
import {CommonTextNode, CommonTextNodeClass, CommonTextNodeMixin} from '../../common/Wrappers/TextNode.js';
import {MmlNode, TextNode} from '../../../core/MmlTree/MmlNode.js';
import {StyleList} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 * The SVGTextNode interface for the SVG TextNode wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGTextNodeNTD<N, T, D> extends SVGWrapper<N, T, D>, CommonTextNode<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {}

/**
 * The SVGTextNodeClass interface for the SVG TextNode wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGTextNodeClass<N, T, D> extends SVGWrapperClass<N, T, D>, CommonTextNodeClass<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {
  new(factory: SVGWrapperFactory<N, T, D>, node: MmlNode, parent?: SVGWrapper<N, T, D>): SVGTextNodeNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SVGTextNode wrapper for the MmlTextNode class
 */
export const SVGTextNode = (function <N, T, D>(): SVGTextNodeClass<N, T, D> {

  const Base = CommonTextNodeMixin<
      N, T, D,
      SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
      SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass,
      SVGTextNodeClass<N, T, D>
    >(SVGWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be SVGWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SVGTextNode extends Base implements SVGTextNodeNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = TextNode.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleList = {
      'mjx-container[jax="SVG"] path[data-c], mjx-container[jax="SVG"] use[data-c]': {
        'stroke-width': 3
      }
    };

    /**
     * @override
     */
    public toSVG(parent: N) {
      const text = (this.node as TextNode).getText();
      const variant = this.parent.variant;
      if (text.length === 0) return;
      if (variant === '-explicitFont') {
        this.element = this.adaptor.append(parent, this.jax.unknownText(text, variant)) as N;
      } else {
        const chars = this.remappedText(text, variant);
        if (this.parent.childNodes.length > 1) {
          parent = this.element = this.adaptor.append(parent, this.svg('g', {'data-mml-node': 'text'})) as N;
        }
        let x = 0;
        for (const n of chars) {
          x += this.placeChar(n, x, 0, parent, variant);
        }
      }
    }

  };

})<any, any, any>();
