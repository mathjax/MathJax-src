/*************************************************************
 *
 *  Copyright (c) 2018-2026 The MathJax Consortium
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
import { CommonOutputJax, COMMON_FONT } from '../../common.js';
import { CommonTextNode } from './TextNode.js';
import { MmlNode, TextNode } from '../../../core/MmlTree/MmlNode.js';
import { BBox } from '../../../util/BBox.js';
import { DOM_TYPES } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The CommonMglyph interface
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export interface CommonMglyph<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends CommonWrapper<DOM, FONT, JX, WW, WF, WC> {
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
  charWrapper: CommonTextNode<DOM, FONT, JX, WW, WF, WC>;

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
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export interface CommonMglyphClass<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC> {}

/*****************************************************************/
/**
 * The CommonMglyph wrapper mixin for the MmlMglyph object
 *
 * @param {CommonWrapperConstructor} Base The constructor class to extend
 * @returns {B} The mixin constructor
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 *
 * @template B     The mixin interface to create
 */
export function CommonMglyphMixin<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
  B extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
>(Base: CommonWrapperConstructor<DOM, FONT, JX, WW, WF, WC>): B {
  return class CommonMglyphMixin
    extends Base
    implements CommonMglyph<DOM, FONT, JX, WW, WF, WC>
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
    public charWrapper: CommonTextNode<DOM, FONT, JX, WW, WF, WC>;

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
