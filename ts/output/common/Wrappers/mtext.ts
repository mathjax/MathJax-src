/*************************************************************
 *
 *  Copyright (c) 2019-2025 The MathJax Consortium
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
 * @file  Implements the CommonMtext wrapper mixin for the MmlMtext object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {
  CommonWrapper,
  CommonWrapperClass,
  CommonWrapperConstructor,
} from '../Wrapper.js';
import { CommonWrapperFactory } from '../WrapperFactory.js';
import {
  CharOptions,
  VariantData,
  DelimiterData,
  FontData,
  FontDataClass,
} from '../FontData.js';
import { CommonOutputJax } from '../../common.js';
import { TextNode } from '../../../core/MmlTree/MmlNode.js';
import { IndexData } from '../LinebreakVisitor.js';
import { LineBBox } from '../LineBBox.js';

/*****************************************************************/
/**
 * The CommonMtext interface
 *
 * @template N   The DOM node type
 * @template T   The DOM text node type
 * @template D   The DOM document type
 * @template JX  The OutputJax type
 * @template WW  The Wrapper type
 * @template WF  The WrapperFactory type
 * @template WC  The WrapperClass type
 * @template CC  The CharOptions type
 * @template VV  The VariantData type
 * @template DD  The DelimiterData type
 * @template FD  The FontData type
 * @template FC  The FontDataClass type
 */
export interface CommonMtext<
  N,
  T,
  D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>,
> extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {
  /**
   * The list of breakpoints within the text
   */
  breakPoints: IndexData[];

  /**
   * A fake text node used for measuring text substrings
   */
  textNode: WW;

  /**
   * @param {string} text   The string whose width is needed
   * @returns {number}       The width of the string
   */
  textWidth(text: string): number;

  /**
   * @param {IndexData} ij  The child and character indices for the breakpoint
   */
  setBreakAt(ij: IndexData): void;

  /**
   * Clear the breakPoints array
   */
  clearBreakPoints(): void;

  /**
   * @param {number} i   The breakpoint whose line width is needed
   * @returns {number}    The width of the text between that breakpoint and the previous one
   */
  getBreakWidth(i: number): number;
}

/**
 * The CommonMtextClass interface
 *
 * @template N   The DOM node type
 * @template T   The DOM text node type
 * @template D   The DOM document type
 * @template JX  The OutputJax type
 * @template WW  The Wrapper type
 * @template WF  The WrapperFactory type
 * @template WC  The WrapperClass type
 * @template CC  The CharOptions type
 * @template VV  The VariantData type
 * @template DD  The DelimiterData type
 * @template FD  The FontData type
 * @template FC  The FontDataClass type
 */
export interface CommonMtextClass<
  N,
  T,
  D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>,
> extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {
  /**
   * The font-family, weight, and style to use for the variants when mtextInheritFont
   * is true or mtextFont is specified.  If not in this list, then the font's
   * getCssFont() is called.  When the font family is not specified, the inherited
   * or specified font is used.
   */
  INHERITFONTS: { [name: string]: [string, boolean, boolean] };
}

/*****************************************************************/
/**
b *  The CommonMtext wrapper mixin for the MmlMtext object
 *
 * @param {CommonWrapperConstructor} Base The constructor class to extend
 * @returns {B} The mixin constructor
 * @template N   The DOM node type
 * @template T   The DOM text node type
 * @template D   The DOM document type
 * @template JX  The OutputJax type
 * @template WW  The Wrapper type
 * @template WF  The WrapperFactory type
 * @template WC  The WrapperClass type
 * @template CC  The CharOptions type
 * @template VV  The VariantData type
 * @template DD  The DelimiterData type
 * @template FD  The FontData type
 * @template FC  The FontDataClass type
 *
 * @template B   The mixin interface to create
 */
export function CommonMtextMixin<
  N,
  T,
  D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>,
  B extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
>(
  Base: CommonWrapperConstructor<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
): B {
  return class CommonMtextMixin
    extends Base
    implements CommonMtext<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
  {
    /**
     * @override
     */
    public static INHERITFONTS: { [name: string]: [string, boolean, boolean] } =
      {
        normal: ['', false, false],
        bold: ['', false, true],
        italic: ['', true, false],
        'bold-italic': ['', true, true],
      };

    /**
     * @override
     */
    public breakPoints: IndexData[] = [];

    /**
     * Cached TextNode used for measuring text.
     */
    public textNode: WW;

    /**
     * @override
     */
    public textWidth(text: string) {
      let textNode = this.textNode;
      if (!textNode) {
        const text = this.node.factory.create('text');
        text.parent = this.node;
        textNode = this.textNode = this.factory.wrap(text);
        textNode.parent = this as any as WW;
      }
      (textNode.node as any as TextNode).setText(text);
      textNode.invalidateBBox(false);
      return textNode.getBBox().w;
    }

    /**
     * @override
     */
    get breakCount() {
      return this.breakPoints.length;
    }

    /**
     * @override
     */
    protected getVariant() {
      const options = this.jax.options;
      const data = this.jax.math.outputData;
      //
      //  If the font is to be inherited from the surrounding text, check the mathvariant
      //  and see if it allows for inheritance. If so, set the variant appropriately,
      //  otherwise get the usual variant.
      //
      const merror =
        (!!data.merrorFamily || !!options.merrorFont) &&
        this.node.Parent.isKind('merror');
      if (!!data.mtextFamily || !!options.mtextFont || merror) {
        const variant = this.node.attributes.get('mathvariant') as string;
        const font =
          (this.constructor as any).INHERITFONTS[variant] ||
          this.jax.font.getCssFont(variant);
        const family =
          font[0] ||
          (merror
            ? data.merrorFamily || options.merrorFont
            : data.mtextFamily || options.mtextFont);
        this.variant = this.explicitVariant(
          family,
          font[2] ? 'bold' : '',
          font[1] ? 'italic' : ''
        );
        return;
      }
      super.getVariant();
    }

    /**
     * @override
     */
    public setBreakAt(ij: IndexData) {
      this.breakPoints.push(ij);
    }

    /**
     * @override
     */
    public clearBreakPoints() {
      this.breakPoints = [];
    }

    /**
     * @override
     */
    public computeLineBBox(i: number): LineBBox {
      const bbox = LineBBox.from(
        this.getOuterBBox(),
        this.linebreakOptions.lineleading
      );
      if (!this.breakCount) return bbox;
      bbox.w = this.getBreakWidth(i);
      if (i === 0) {
        bbox.R = 0;
        this.addLeftBorders(bbox);
      } else {
        bbox.L = 0;
        bbox.indentData = [
          ['left', '0'],
          ['left', '0'],
          ['left', '0'],
        ]; // FIXME: do something better, here
        if (i === this.breakCount) {
          this.addRightBorders(bbox);
        }
      }
      return bbox;
    }

    /**
     * @override
     */
    public getBreakWidth(i: number) {
      const childNodes = this.childNodes;
      let [si, sj] = this.breakPoints[i - 1] || [0, 0];
      const [ei, ej] = this.breakPoints[i] || [childNodes.length, 0];
      let words = (childNodes[si].node as TextNode).getText().split(/ /);
      if (si === ei) {
        return this.textWidth(words.slice(sj, ej).join(' '));
      }
      let w = this.textWidth(words.slice(sj).join(' '));
      while (++si < ei && si < childNodes.length) {
        w += childNodes[si].getBBox().w;
      }
      if (si < childNodes.length) {
        words = (childNodes[si].node as TextNode).getText().split(/ /);
        w += this.textWidth(words.slice(0, ej).join(' '));
      }
      return w;
    }
  } as any as B;
}
