/*************************************************************
 *
 *  Copyright (c) 2017-2025 The MathJax Consortium
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
 * @file  Implements the SvgTextNode wrapper for the TextNode object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  SvgCharOptions,
  SvgVariantData,
  SvgDelimiterData,
  SvgFontData,
  SvgFontDataClass,
} from '../FontData.js';
import {
  CommonTextNode,
  CommonTextNodeClass,
  CommonTextNodeMixin,
} from '../../common/Wrappers/TextNode.js';
import { MmlNode, TextNode } from '../../../core/MmlTree/MmlNode.js';
import { StyleJsonSheet } from '../../../util/StyleJson.js';

/*****************************************************************/
/**
 * The SvgTextNode interface for the SVG TextNode wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgTextNodeNTD<N, T, D>
  extends
    SvgWrapper<N, T, D>,
    CommonTextNode<
      N,
      T,
      D,
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass
    > {}

/**
 * The SvgTextNodeClass interface for the SVG TextNode wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgTextNodeClass<N, T, D>
  extends
    SvgWrapperClass<N, T, D>,
    CommonTextNodeClass<
      N,
      T,
      D,
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass
    > {
  new (
    factory: SvgWrapperFactory<N, T, D>,
    node: MmlNode,
    parent?: SvgWrapper<N, T, D>
  ): SvgTextNodeNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgTextNode wrapper for the MmlTextNode class
 */
export const SvgTextNode = (function <N, T, D>(): SvgTextNodeClass<N, T, D> {
  const Base = CommonTextNodeMixin<
    N,
    T,
    D,
    SVG<N, T, D>,
    SvgWrapper<N, T, D>,
    SvgWrapperFactory<N, T, D>,
    SvgWrapperClass<N, T, D>,
    SvgCharOptions,
    SvgVariantData,
    SvgDelimiterData,
    SvgFontData,
    SvgFontDataClass,
    SvgTextNodeClass<N, T, D>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be SvgWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class SvgTextNode extends Base implements SvgTextNodeNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = TextNode.prototype.kind;

    /**
     * @override
     */
    public static addStyles<JX extends SVG<any, any, any>>(
      styles: StyleJsonSheet,
      jax: JX
    ) {
      styles.addStyles({
        'mjx-container[jax="SVG"] path[data-c], mjx-container[jax="SVG"] use[data-c]':
          {
            'stroke-width': jax.options.blacker,
          },
      });
    }

    /**
     * @override
     */
    public toSVG(parents: N[]) {
      const adaptor = this.adaptor;
      const variant = this.parent.variant;
      const text = (this.node as TextNode).getText();
      if (text.length === 0) return;
      if (variant === '-explicitFont') {
        this.dom = [
          adaptor.append(parents[0], this.jax.unknownText(text, variant)) as N,
        ];
      } else {
        const chars = this.remappedText(text, variant);
        if (this.parent.childNodes.length > 1) {
          parents = this.dom = [
            adaptor.append(
              parents[0],
              this.svg('g', { 'data-mml-node': 'text' })
            ) as N,
          ];
        } else {
          this.dom = parents;
        }
        let x = 0;
        for (const n of chars) {
          x += this.placeChar(n, x, 0, parents[0], variant, true);
        }
        this.addUtext(x, 0, parents[0], variant);
      }
    }
  };
})<any, any, any>();
