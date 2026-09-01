/*************************************************************
 *
 *  Copyright (c) 2017-2026 The MathJax Consortium
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

import { SVG, SVG_FONT } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  CommonTextNode,
  CommonTextNodeClass,
  CommonTextNodeMixin,
} from '../../common/Wrappers/TextNode.js';
import { MmlNode, TextNode } from '../../../core/MmlTree/MmlNode.js';
import { StyleJsonSheet } from '../../../util/StyleJson.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The SvgTextNode interface for the SVG TextNode wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgTextNodeNTD<DOM extends DOM_TYPES>
  extends
    SvgWrapper<DOM>,
    CommonTextNode<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgTextNodeClass interface for the SVG TextNode wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgTextNodeClass<DOM extends DOM_TYPES>
  extends
    SvgWrapperClass<DOM>,
    CommonTextNodeClass<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {
  new (
    factory: SvgWrapperFactory<DOM>,
    node: MmlNode,
    parent?: SvgWrapper<DOM>
  ): SvgTextNodeNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgTextNode wrapper for the MmlTextNode class
 */
export const SvgTextNode = (function (): SvgTextNodeClass<DOM> {
  const Base = CommonTextNodeMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgTextNodeClass<DOM>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class SvgTextNode extends Base implements SvgTextNodeNTD<DOM> {
    /**
     * @override
     */
    public static kind = TextNode.prototype.kind;

    /**
     * @override
     */
    public static addStyles<JX extends SVG<DOM>>(
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
    public toSVG(parents: N<DOM>[]) {
      const adaptor = this.adaptor;
      const variant = this.parent.variant;
      const text = (this.node as TextNode).getText();
      if (text.length === 0) return;
      if (variant === '-explicitFont') {
        this.dom = [
          adaptor.append(
            parents[0],
            this.jax.unknownText(text, variant)
          ) as N<DOM>,
        ];
      } else {
        const chars = this.remappedText(text, variant);
        if (this.parent.childNodes.length > 1) {
          parents = this.dom = [
            adaptor.append(
              parents[0],
              this.svg('g', { 'data-mml-node': 'text' })
            ) as N<DOM>,
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
})();
