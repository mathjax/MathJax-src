/*************************************************************
 *
 *  Copyright (c) 2019-2026 The MathJax Consortium
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
 * @file  Implements the SvgMtext wrapper for the MmlMtext object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG, SVG_FONT } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMtext,
  CommonMtextClass,
  CommonMtextMixin,
} from '../../common/Wrappers/mtext.js';
import { MmlNode, TextNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMtext } from '../../../core/MmlTree/MmlNodes/mtext.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The SvgMtext interface for the SVG Mtext wrapper
 *
 * @template DOM   The DOM types
 */
export interface SvgMtextNTD<DOM extends DOM_TYPES>
  extends
    SvgWrapper<DOM>,
    CommonMtext<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgMtextClass interface for the SVG Mtext wrapper
 *
 * @template DOM   The DOM types
 */
export interface SvgMtextClass<DOM extends DOM_TYPES>
  extends
    SvgWrapperClass<DOM>,
    CommonMtextClass<
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
  ): SvgMtextNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgMtext wrapper class for the MmlMtext class
 */
export const SvgMtext = (function (): SvgMtextClass<DOM> {
  const Base = CommonMtextMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgMtextClass<DOM>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class SvgMtext extends Base implements SvgMtextNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMtext.prototype.kind;

    /**
     * @override
     */
    public toSVG(parents: N<DOM>[]) {
      //
      // If no breakpoints, do the usual thing
      //
      if (!this.breakCount) {
        super.toSVG(parents);
        return;
      }
      //
      // Get the line containers and loop through them
      //
      const svg = this.standardSvgNodes(parents);
      const textNode = this.textNode.node as TextNode;
      const childNodes = this.childNodes;
      for (const i of svg.keys()) {
        const DOM = [svg[i]];
        //
        // Get the start and end indices
        //
        let [si, sj] = this.breakPoints[i - 1] || [0, 0];
        const [ei, ej] = this.breakPoints[i] || [childNodes.length, 0];
        //
        // Get the words for the start child, and if the start and end
        //   are in the same child, output the needed words
        //
        let words = (childNodes[si].node as TextNode).getText().split(/ /);
        if (si === ei) {
          textNode.setText(words.slice(sj, ej).join(' '));
          this.textNode.toSVG(DOM);
          continue;
        }
        //
        // Otherwise, output from the start to the end of the child
        //
        textNode.setText(words.slice(sj).join(' '));
        this.textNode.toSVG(DOM);
        let x = this.textNode.getBBox().w;
        //
        // Add in any additional full children before the end child
        //
        while (++si < ei && si < childNodes.length) {
          const child = childNodes[si];
          child.toSVG(DOM);
          if (child.dom) {
            child.place(x, 0);
          }
          x += child.getBBox().w;
        }
        //
        // Add the beginning of the end child up to the end break
        //
        if (si < childNodes.length) {
          words = (childNodes[si].node as TextNode).getText().split(/ /);
          textNode.setText(words.slice(0, ej).join(' '));
          this.textNode.toSVG(DOM);
          this.textNode.place(x, 0);
        }
      }
    }
  };
})();
