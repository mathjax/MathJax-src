/*************************************************************
 *
 *  Copyright (c) 2018-2025 The MathJax Consortium
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
 * @file  Implements the CommonMglyph wrapper mixin for the MmlMglyph object
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
import { CommonTextNode } from './TextNode.js';
import { MmlNode, TextNode } from '../../../core/MmlTree/MmlNode.js';
import { BBox } from '../../../util/BBox.js';

/*****************************************************************/
/**
 * The CommonMglyph interface
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
export interface CommonMglyph<
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
   * The image's width converted to em's
   */
  width: number;
  /**
   * The image's height converted to em's
   */
  height: number;
  /*
   * The image's valign values converted to em's
   */
  valign: number;

  /**
   * TextNode used for deprecated fontfamily/index use case
   */
  charWrapper: CommonTextNode<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>;

  /**
   * Obtain the width, height, and valign.
   * Note:  Currently, the width and height must be specified explicitly, or they default to 1em
   *   Since loading the image may be asynchronous, it would require a restart.
   *   A future extension could implement this either by subclassing this object, or
   *   perhaps as a post-filter on the MathML input jax that adds the needed dimensions
   */
  getParameters(): void;
}

/**
 * The CommonMglyphClass interface
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
export interface CommonMglyphClass<
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
> extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {}

/*****************************************************************/
/**
 * The CommonMglyph wrapper mixin for the MmlMglyph object
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
export function CommonMglyphMixin<
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
  return class CommonMglyphMixin
    extends Base
    implements CommonMglyph<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
  {
    /**
     * @override
     */
    public width: number;
    /**
     * @override
     */
    public height: number;
    /**
     * @override
     */
    public valign: number;

    /**
     * @override
     */
    /* prettier-ignore */
    public charWrapper:
      CommonTextNode<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>;

    /**
     * @override
     * @class
     */
    constructor(factory: WF, node: MmlNode, parent: WW = null) {
      super(factory, node, parent);
      this.getParameters();
    }

    /**
     * @override
     */
    public getParameters() {
      const { width, height, valign, src, index } =
        this.node.attributes.getList(
          'width',
          'height',
          'valign',
          'src',
          'index'
        );
      if (src) {
        this.width = width === 'auto' ? 1 : this.length2em(width);
        this.height = height === 'auto' ? 1 : this.length2em(height);
        this.valign = this.length2em(valign || '0');
      } else {
        const text = String.fromCodePoint(parseInt(index as string));
        const mmlFactory = this.node.factory;
        this.charWrapper = this.wrap(
          (mmlFactory.create('text') as TextNode).setText(text)
        );
        this.charWrapper.parent = this as any as WW;
      }
    }

    /**
     * @override
     */
    public computeBBox(bbox: BBox, _recompute: boolean = false) {
      if (this.charWrapper) {
        bbox.updateFrom(this.charWrapper.getBBox());
      } else {
        bbox.w = this.width;
        bbox.h = this.height + this.valign;
        bbox.d = -this.valign;
      }
    }
  } as any as B;
}
